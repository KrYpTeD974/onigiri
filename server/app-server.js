var game;

function Server(port)
{
    var io = require('socket.io').listen(port);
    var express = require('express');
    var app = express();
    app.get('/', function(req, res) {
        res.render('home.ejs');
    });
    app.listen(80)

    io.sockets.on('connection', function (socket) 
    {
        socket.on('create', function(room) {
            console.log("join room: " + room);
            socket.join(room);
            if (game == undefined)
            {
                game = new Game(socket, room);
            }
            game.addPlayer("bob", "blue");

          });

    });


}
var server = Server(8080);


function Game(socket, room)
{

    console.log("Creating new Game : " + room);
    var INITIAL_NB_TATAMI = 15;
    this.players = [];
    this.is_started = false;
    this.socket = socket;
    this._room = room;

    this.addPlayer = function(name, color)
    {
        var player = new Player(name, color, this.players.lenght+1, INITIAL_NB_TATAMI);
        this.players.push(player);
        console.log("Add player :" + player);
        return player;
    }

    this.start_game = function()
    {
        this.is_started = true;
    }

}

function Player(name, color, number, tatami_restants)
{
    if (name == ""){
        name = "Yohan"
    }
    this.name = name;
    this.color = color;
    this.number = number;
    this.tatami_restants = tatami_restants;
}
