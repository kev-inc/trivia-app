const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { addNewPlayer, removePlayer, getPlayerList, addScoreToPlayer, getAllScoresDesc, freezeAndUpdateTop5 } = require('./data/players');
const { getQuizResponses, addQuizResponse, getQuizTotalResponses, initialiseQuizResponses, getQuestionResponses, getTop5PlayersAndScores, addPlayerResponse, getQuestionResponsesSum, getFullLeaderboard, setQuestionStartTime } = require('./data/responses');
const { db, initialiseDB } = require('./data/db');
const { GameState, gamestate, handleTransitionToNextState, resetGamestate } = require('./data/gamestate');

initialiseDB()
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

app.get('/resetgamestate', (req, res) => {
    resetGamestate()
    res.send('gamestate resetted')
})

io.on('connection', (socket) => {

    // When server receives 'joinGame', add the user, send back 'joinedGame' to client, broadcast 'screen:updatePlayers' to screen to refresh player count
    socket.on('joinGame', ({username}) => {
        if (gamestate.state != GameState.NEW) {
            socket.emit('joinGameError', ({msg: "Oops! The game has already started :("}))
            return
        }
        try {
            addNewPlayer(socket.id, username)
            socket.emit('joinedGame', {username})
            gamestate.players = getPlayerList()
            io.emit('updatePlayers', {players: gamestate.players})
        } catch (e) {
            console.log(e)
            socket.emit('joinGameError', {msg: "Please try again with a different name"})
        }
    })

    socket.on('requestNextState', () => {
        handleTransitionToNextState()
        io.emit('updateState', {gamestate})
    })

    // When server receives 'startGame', broadcast 'gameStarting' to all connected devices
    socket.on('startGame', () => {
        gamestate.state = GameState.STARTING_QUIZ
        io.emit('updateState', {gamestate})
    })

    socket.on('userAnsweredQuestion', ({name, questionNo, answer, correct}) => {
        addPlayerResponse(socket.id, name, questionNo, answer, correct)
        gamestate.answeredCount = getQuestionResponsesSum(questionNo)
        io.emit('updateAnsweredCount', {gamestate})
        socket.emit('userAnswered')
    })

    socket.on('disconnect', () => {
        console.log(socket.id, 'just left')
        removePlayer(socket.id)
        gamestate.players = getPlayerList()
        io.emit('updatePlayers', {players: gamestate.players})
    })

    gamestate.players = getPlayerList()
    socket.emit('updateState', {gamestate})
    console.log(socket.id, 'connected');
});

server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});