const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const players = []

app.get('/', (req, res) => {
    res.send('server is running');
});

io.on('connection', (socket) => {

    socket.on('joinGame', ({username}) => {
        players.push({id: socket.id, username: username})
        console.log('players', players)
        socket.emit('joinedGame', {username})
        io.emit('screen:updatePlayers', {players})
    })

    socket.on('startGame', () => {
        io.emit('gameStarting')
    })
    socket.on('screen:startingNextQuestion', () => {
        io.emit('startingNextQuestion')
    })
    socket.on('screen:showQuestion', () => {
        io.emit('showQuestion')
    })
    socket.on('screen:showAnswers', () => {
        io.emit('showAnswers')
    })
    socket.on('screen:showResult', () => {
        io.emit('showResult')
    })
    socket.on('screen:showLeaderboard', () => {
        io.emit('showLeaderboard')
    })
    socket.on('screen:showFinalResults', () => {
        io.emit('showFinalResults')
    })

    socket.on('disconnect', () => {
        console.log(socket.id, 'just left')
        const findIndex = players.findIndex(p => p.id == socket.id)
        if (findIndex !== -1) {
            players.splice(findIndex, 1)
        }
        io.emit('screen:updatePlayers', {players})
    })

    socket.emit('screen:updatePlayers', {players})
    console.log(socket.id, 'connected');
});

server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});