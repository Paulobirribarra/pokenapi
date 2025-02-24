require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Configuración de Plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importar rutas de Pokémon
const pokemonRoutes = require('./routes/pokenmonRoutes');
app.use('/', pokemonRoutes);

// Lanzar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor Corriendo en http://localhost:${PORT}`);
});
