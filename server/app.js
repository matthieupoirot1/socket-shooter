const express = require("express");
const socket = require('socket.io');
const expressServer = express();
const Server = require('./Server');

console.log('The app is now running at http://localhost:23000');
expressServer.use(express.static("public"));

let app = expressServer.listen(23000);

let io = socket(app);

let server = new Server(io);








