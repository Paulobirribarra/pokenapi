const express = require('express');
const router = express.Router();
const axios = require('axios');

// Página principal con Pokémon por defecto
router.get("/", async (req, res) => {
    try {
        // Obtener lista de 20 Pokémon
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
        const pokemonResults = response.data.results;

        const pokemonPromises = pokemonResults.map(async (poke) => {
            const pokeData = await axios.get(poke.url);
            const speciesData = await axios.get(pokeData.data.species.url);

            return {
                id: pokeData.data.id,
                name: pokeData.data.name,
                sprite: pokeData.data.sprites.front_default || "https://via.placeholder.com/100",
                types: pokeData.data.types.map(t => t.type.name),
                evolves_from: speciesData.data.evolves_from_species // Si tiene, no es fase 1
            };
        });

        // Esperar a que todas las peticiones se completen
        let pokemons = await Promise.all(pokemonPromises);

        // Filtrar para mostrar solo las primeras fases de evolución
        pokemons = pokemons.filter(poke => !poke.evolves_from);

        res.render("index", { pokemons, pokemon: null, error: null });
    } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
        res.render("index", { pokemon: null, pokemons: [], error: "No se pudieron obtener los Pokémon" });
    }
});



// Ruta para buscar un Pokémon
router.get("/pokemon", async (req, res) => {
    const name = req.query.name?.toLowerCase();
    if (!name) {
        return res.render("index", { pokemon: null, pokemons: [], error: "Debes ingresar un nombre o ID" });
    }

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemon = {
            id: response.data.id,
            name: response.data.name,
            sprite: response.data.sprites.front_default || "https://via.placeholder.com/100",
            types: response.data.types.map(t => t.type.name)
        };

        res.render("index", { pokemon, pokemons: [pokemon], error: null });
    } catch (error) {
        console.error("Error al obtener el Pokémon:", error);
        res.render("index", { pokemon: null, pokemons: [], error: "Pokémon no encontrado" });
    }
});

module.exports = router;
