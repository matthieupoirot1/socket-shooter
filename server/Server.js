const GameRoom = require("./GameRoom");

class Server{

    constructor(ioServer){
        this.gameRooms = [];
        this.ioServer = ioServer;
        this.initiateConnection(ioServer);
    }

    initiateConnection(ioServer){
        ioServer.sockets.on("connection", socket => {
            console.log(`New connection ${socket.id}`);
            this.attributeGameRoom(socket)
        });
    }

    attributeGameRoom(clientSocket){
        if(!this.gameRooms.length || this.gameRooms[this.gameRooms.length-1].isFull()){
            this.gameRooms.push(new GameRoom(this.ioServer));
        }
        this.gameRooms[this.gameRooms.length-1].createPlayer(clientSocket);
    }
}

module.exports = Server;