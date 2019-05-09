require('dotenv').config();

const http = require('http');
const app = require('./app');

const port = process.env.port || 3003;

const server = http.createServer(app);

server.listen(port);