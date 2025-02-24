const express = require('express');
const router = express.Router();
const axios = require('axios');

const POKEMON_PER_PAGE = 24;

// Ruta principal con Pokémon base y sus evoluciones
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * POKEMON_PER_PAGE;

        // 📌 1️⃣ Obtener la Pokédex Nacional para evitar formas alternativas y variantes
        const response = await axios.get("https://pokeapi.co/api/v2/pokedex/national");
        const pokemonEntries = response.data.pokemon_entries;

        // 📌 2️⃣ Obtener información detallada de cada Pokémon
        const pokemonPromises = pokemonEntries.map(async (entry) => {
            try {
                const pokeData = await axios.get(`https://pokeapi.co/api/v2/pokemon/${entry.pokemon_species.name}`);
                const speciesData = await axios.get(pokeData.data.species.url);
                const evolutionChainUrl = speciesData.data.evolution_chain.url;
                const evolutions = await getEvolutions(evolutionChainUrl);

                return {
                    id: pokeData.data.id,
                    name: pokeData.data.name,
                    sprite: pokeData.data.sprites.front_default || "https://via.placeholder.com/100",
                    types: pokeData.data.types.map(t => t.type.name),
                    evolutions
                };
            } catch (error) {
                //console.error(`Error al obtener datos de ${entry.pokemon_species.name}:`, error.message);
                return null;
            }
        });

        let pokemons = await Promise.all(pokemonPromises);

        // 📌 3️⃣ Filtrar solo los Pokémon base (primera fase de evolución)
        pokemons = pokemons.filter(poke => {
            if (!poke || !poke.evolutions.length) return true; // Si no tiene evoluciones, se mantiene
            return poke.id === parseInt(poke.evolutions[0]?.id); // Asegurar que es la fase base
        });

        // 📌 4️⃣ Aplicar paginación después del filtrado
        const totalPages = Math.ceil(pokemons.length / POKEMON_PER_PAGE);
        const paginatedPokemons = pokemons.slice(offset, offset + POKEMON_PER_PAGE);

        res.render("index", {
            pokemons: paginatedPokemons,
            pokemon: null,
            error: null,
            currentPage: page,
            totalPages
        });

    } catch (error) {
        console.error("Error al obtener los Pokémon:", error.message);
        res.render("index", { pokemon: null, pokemons: [], error: "No se pudieron obtener los Pokémon" });
    }
});

// 📌 Función para obtener la cadena de evolución
async function getEvolutions(evolutionChainUrl) {
    try {
        if (!evolutionChainUrl) return [];

        const response = await axios.get(evolutionChainUrl);
        let chain = response.data.chain;
        let evolutions = [];

        // Recorrer la cadena de evolución
        while (chain) {
            evolutions.push({
                id: chain.species.url.split('/').slice(-2, -1)[0], // Guardamos ID para comparación
                name: chain.species.name,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${chain.species.url.split('/').slice(-2, -1)[0]}.png`
            });
            chain = chain.evolves_to.length ? chain.evolves_to[0] : null;
        }

        return evolutions;
    } catch (error) {
        console.error("Error al obtener las evoluciones:", error.message);
        return [];
    }
}

// Ruta para buscar un Pokémon específico
router.get("/pokemon", async (req, res) => {
    const name = req.query.name?.toLowerCase();
    if (!name) {
        return res.render("index", { pokemon: null, pokemons: [], error: "Debes ingresar un nombre o ID", currentPage: 1, totalPages: 1 });
    }

    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemon = {
            id: response.data.id,
            name: response.data.name,
            sprite: response.data.sprites.front_default || "https://via.placeholder.com/100",
            types: response.data.types.map(t => t.type.name)
        };

        res.render("index", { pokemon, pokemons: [], error: null, currentPage: 1, totalPages: 1 });
    } catch (error) {
        console.error("Error al obtener el Pokémon:", error.message);
        res.render("index", { pokemon: null, pokemons: [], error: "Pokémon no encontrado", currentPage: 1, totalPages: 1 });
    }
});


module.exports = router;
