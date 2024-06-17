const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { addNewPlayer, removePlayer, getPlayerList, addScoreToPlayer, getAllScoresDesc, freezeAndUpdateTop5 } = require('./data/players');
const { getQuizResponses, addQuizResponse, getQuizTotalResponses, initialiseQuizResponses, getQuestionResponses, getTop5PlayersAndScores, addPlayerResponse, getQuestionResponsesSum, getFullLeaderboard, setQuestionStartTime } = require('./data/responses');
const { db, initialiseDB, resetDB } = require('./data/db');
const { GameState, gamestate, handleTransitionToNextState, resetGamestate } = require('./data/gamestate');
const SOCKET_MESSAGES = require('./data/constants');

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

io.on('connection', (socket) => {

    // When server receives 'joinGame', add the user, send back 'joinedGame' to client, broadcast 'screen:updatePlayers' to screen to refresh player count
    socket.on(SOCKET_MESSAGES.C2S.JOIN_GAME, ({username}) => {
        if (gamestate.state != GameState.NEW) {
            socket.emit(SOCKET_MESSAGES.S2C.JOIN_GAME_ERROR, ({msg: "Oops! The game has already started :("}))
            return
        }
        try {
            addNewPlayer(socket.id, username)
            socket.emit(SOCKET_MESSAGES.S2C.JOINED_GAME, {username})
            gamestate.players = getPlayerList()
            io.emit(SOCKET_MESSAGES.S2C.UPDATE_PLAYERS, {players: gamestate.players})
        } catch (e) {
            console.log(e)
            socket.emit(SOCKET_MESSAGES.S2C.JOIN_GAME_ERROR, {msg: "Please try again with a different name"})
        }
    })

    socket.on(SOCKET_MESSAGES.C2S.REQUEST_NEXT_STATE, () => {
        handleTransitionToNextState()
        io.emit(SOCKET_MESSAGES.S2C.UPDATE_STATE, {gamestate})
    })

    socket.on(SOCKET_MESSAGES.C2S.USER_ANSWERED_QUESTION, ({name, questionNo, answer, correct}) => {
        addPlayerResponse(socket.id, name, questionNo, answer, correct)
        gamestate.answeredCount = getQuestionResponsesSum(questionNo)
        io.emit(SOCKET_MESSAGES.S2C.UPDATE_ANSWERED_COUNT, {gamestate})
        socket.emit(SOCKET_MESSAGES.S2C.USER_ANSWERED)
    })

    socket.on(SOCKET_MESSAGES.C2S.DISCONNECT, () => {
        console.log(socket.id, 'just left')
        removePlayer(socket.id)
        gamestate.players = getPlayerList()
        io.emit(SOCKET_MESSAGES.S2C.UPDATE_PLAYERS, {players: gamestate.players})
    })

    socket.on(SOCKET_MESSAGES.C2S.RESET_GS, () => {
        resetGamestate()
        resetDB()
        initialiseDB()
        io.emit(SOCKET_MESSAGES.S2C.UPDATE_STATE, {gamestate})
    })

    gamestate.players = getPlayerList()
    socket.emit(SOCKET_MESSAGES.S2C.UPDATE_STATE, {gamestate})
    console.log(socket.id, 'connected');
});

server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
});