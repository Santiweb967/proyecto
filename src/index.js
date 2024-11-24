// Importa el módulo express para poder crear el servidor y manejar las rutas
const express = require('express');

// Importa el módulo path para manejar las rutas de los archivos de manera segura y compatible con diferentes sistemas operativos
const path = require('path');

// Crea una instancia de la aplicación Express
const app = express();

// Define el puerto en el que se ejecutará el servidor
const port = 8080;

// Sirve archivos estáticos (como imágenes, CSS, JS) desde la carpeta raíz del proyecto
app.use(express.static(path.join(__dirname, '/')));

// Define la ruta principal de la aplicación ('/') que cuando sea visitada, envía el archivo 'registro.html' como respuesta
app.get('/', (req, res) => {
  // Envía el archivo 'registro.html' como respuesta
  res.sendFile(path.join(__dirname, 'registro.html'));
});

// Inicia el servidor y lo hace escuchar en el puerto especificado (8080)
app.listen(port, () => {
  // Imprime un mensaje en la consola indicando que el servidor está funcionando y escuchando en el puerto especificado
  console.log(`Servidor funcionando en http://localhost:${port}`);
});
