const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { addNewPlayer, removePlayer, getPlayerList, addScoreToPlayer, getAllScoresDesc, freezeAndUpdateTop5 } = require('./data/players');
const { getQuizResponses, addQuizResponse, getQuizTotalResponses, initialiseQuizResponses, getQuestionResponses, getTop5PlayersAndScores, addPlayerResponse, getQuestionResponsesSum, getFullLeaderboard, setQuestionStartTime } = require('./data/responses');
const { db, initialiseDB } = require('./data/db');

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

    socket.on('joinGame', ({username}) => {
        try {
            addNewPlayer(socket.id, username)
            socket.emit('joinedGame', {username})
            io.emit('screen:updatePlayers', {players: getPlayerList()})
        } catch (e) {
            socket.emit('joinGameError')
        }
    })

    socket.on('startGame', () => {
        io.emit('gameStarting')
    })
    socket.on('screen:startingNextQuestion', () => {
        io.emit('startingNextQuestion')
    })
    socket.on('screen:showQuestion', ({question}) => {
        setQuestionStartTime(question, Date.now())
        io.emit('showQuestion', {question})
    })
    socket.on('screen:showAnswers', () => {
        io.emit('showAnswers')
    })
    socket.on('screen:showResult', ({question}) => {
        const responses = new Map(getQuestionResponses(question).map(resp => [resp.answer_selected, resp.count]))
        const responsesArr = [
            responses.get(0) || 0,
            responses.get(1) || 0,
            responses.get(2) || 0,
            responses.get(3) || 0,
        ]
        io.emit('showResult', {responses: responsesArr})
    })
    socket.on('screen:showLeaderboard', ({question}) => {
        const full = getFullLeaderboard(question)
        const prev = getTop5PlayersAndScores(question - 1)
        const latest = getTop5PlayersAndScores(question)
        io.emit('showLeaderboard', {leaderboard: {prev, new: latest, full}})
    })
    socket.on('screen:showFinalResults', () => {
        const leaderboard = getTop5PlayersAndScores(10)
        io.emit('showFinalResults', {leaderboard})
    })

    socket.on('userAnsweredQuestion', ({questionNo, answer, correct}) => {
        addPlayerResponse(socket.id, questionNo, answer, correct)
        const answered = getQuestionResponsesSum(questionNo)
        io.emit('updateAnsweredCount', {answered})
        // if (correct) {
        //     addScoreToPlayer(socket.id, getPlayerList().length - answered)
        // }
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