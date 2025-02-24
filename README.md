# 🏆 Pokédex con Node.js y EJS

Este es un proyecto de Pokédex que utiliza **Node.js**, **Express**, **EJS** y **PokéAPI** para mostrar información detallada de los Pokémon con paginación y búsqueda.

## 🚀 Instalación

Sigue estos pasos para ejecutar el proyecto en tu entorno local.

### 1️⃣ Clona el repositorio  
```sh
git clone https://github.com/tu-usuario/pokedex.git
cd pokedex
```

### 2️⃣ Instala las dependencias  
```sh
npm install
```

### 3️⃣ Configura las variables de entorno  
Crea un archivo **`.env`** en la raíz del proyecto y agrega la siguiente configuración:

```plaintext
POKEAPI_BASE_URL=https://pokeapi.co/api/v2/
PORT=4000
PokedexURI=https://pokeapi.co/api/v2/pokemon
```

### 4️⃣ Inicia el servidor  
Ejecuta uno de los siguientes comandos:

```sh
npm start
```
O si usas **nodemon** (para recarga automática en desarrollo):
```sh
npm run dev
```

---

## 🔍 Uso

- Puedes buscar un Pokémon por su **nombre** o **número** en la Pokédex.
- La Pokédex muestra Pokémon **paginados** con sus evoluciones, si las tienen.
- La información proviene de la API **[PokéAPI](https://pokeapi.co/)**.

---

## 📌 Rutas principales

| Ruta | Descripción |
|------|------------|
| `/` | Página principal con listado de Pokémon paginados |
| `/pokemon?name=bulbasaur` | Busca un Pokémon por nombre o ID |
| `/page/2` | Navega entre páginas de Pokémon |

---

## 🛠 Tecnologías utilizadas

- **Node.js** (JavaScript en el backend)
- **Express** (Framework web)
- **EJS** (Templates para renderizar vistas)
- **Axios** (Para realizar peticiones HTTP a la PokéAPI)
- **dotenv** (Manejo de variables de entorno)
- **Nodemon** (Recarga automática en desarrollo)

---

## 📜 Licencia

Este proyecto es de código abierto y puedes modificarlo o mejorarlo según tus necesidades. ¡Diviértete explorando el mundo Pokémon! 🚀
