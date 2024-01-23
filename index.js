const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { addNewPlayer, removePlayer, getPlayerList, addScoreToPlayer, getAllScoresDesc } = require('./data/players');
const { getQuizResponses, addQuizResponse, getQuizTotalResponses, initialiseQuizResponses } = require('./data/responses');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.get('/', (req, res) => {
    res.send('server is running');
});

io.on('connection', (socket) => {

    socket.on('joinGame', ({username}) => {
        try {
            addNewPlayer(socket.id, username)
            // players.push({id: socket.id, username: username})
            // console.log('players', players)
            socket.emit('joinedGame', {username})
            const players = getPlayerList()
            io.emit('screen:updatePlayers', {players})
        } catch (e) {
            socket.emit('joinGameError')
        }
    })

    socket.on('startGame', () => {
        io.emit('gameStarting')
        initialiseQuizResponses(10)
    })
    socket.on('screen:startingNextQuestion', () => {
        io.emit('startingNextQuestion')
    })
    socket.on('screen:showQuestion', ({question}) => {
        io.emit('showQuestion', {question})
    })
    socket.on('screen:showAnswers', () => {
        io.emit('showAnswers')
    })
    socket.on('screen:showResult', ({question}) => {
        const responses = getQuizResponses(question)
        io.emit('showResult', {responses})
    })
    socket.on('screen:showLeaderboard', () => {
        const leaderboard = getAllScoresDesc()
        io.emit('showLeaderboard', {leaderboard})
    })
    socket.on('screen:showFinalResults', () => {
        const leaderboard = getAllScoresDesc()
        io.emit('showFinalResults', {leaderboard})
    })

    socket.on('userAnsweredQuestion', ({questionNo, answer, correct}) => {
        addQuizResponse(questionNo, answer)
        const answered = getQuizTotalResponses(questionNo)
        io.emit('updateAnsweredCount', {answered})
        if (correct) {
            addScoreToPlayer(socket.id, getPlayerList().length - answered)
        }
        socket.emit('userAnswered')
    })

    socket.on('disconnect', () => {
        console.log(socket.id, 'just left')
        removePlayer(socket.id)
        // const findIndex = players.findIndex(p => p.id == socket.id)
        // if (findIndex !== -1) {
        //     players.splice(findIndex, 1)
        // }
        const players = getPlayerList()
        io.emit('screen:updatePlayers', {players})
    })

    const players = getPlayerList()
    socket.emit('screen:updatePlayers', {players})
    console.log(socket.id, 'connected');
});

server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});