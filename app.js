require('dotenv').config();

// Importamos el modelo
const Server = require('./models/server');

const server = new Server();

server.listen();
