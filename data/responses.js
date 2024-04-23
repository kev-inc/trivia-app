const { db } = require("./db")

const questionStartTime = new Map()
const setQuestionStartTime = (questionNum, unixtime) => {
    questionStartTime[questionNum] = unixtime
}

const addPlayerResponse = (playerId, questionNo, answerNo, isAnswerCorrect) => {
    const points = Math.floor((questionStartTime[questionNo] + (15 * 1000) - Date.now()) / 100)
    const info = db.prepare('INSERT INTO player_responses (player_id, question_number, answer_selected, score) VALUES (?,?,?,?)')
        .run(playerId, questionNo, answerNo, isAnswerCorrect ? points : 0)
}

const getAllResponses = () => {
    const rows = db.prepare('SELECT * FROM player_responses').all()
    return rows
}

const getPlayerScore = (playerId, questionNumber) => {
    // Get player score until question number
    const data = db.prepare('SELECT SUM(score) AS score FROM player_responses WHERE player_id = ? AND question_number <= ?').get(playerId, questionNumber)
    return data['score']
}


const getQuestionResponses = (questionNumber) => {
    const data = db.prepare('SELECT answer_selected, count(1) AS count FROM player_responses WHERE question_number = ? GROUP BY answer_selected').all(questionNumber)
    console.log(data)
    return data
}

const getQuestionResponsesSum = (questionNumber) => {
    const data = db.prepare('SELECT count(1) AS count FROM player_responses WHERE question_number = ?').get(questionNumber)
    return data['count']
}

const getFullLeaderboard = (questionNumber) => {
    const data = db.prepare('SELECT player_id, name, SUM(score) AS score FROM player_responses LEFT JOIN players ON players.id = player_responses.player_id WHERE question_number <= ? GROUP BY player_id ORDER BY score DESC').all(questionNumber)
    return data
}

const getTop5PlayersAndScores = (questionNumber) => {
    const data = db.prepare('SELECT player_id, name, SUM(score) AS score FROM player_responses LEFT JOIN players ON players.id = player_responses.player_id WHERE question_number <= ? GROUP BY player_id ORDER BY score DESC LIMIT 5').all(questionNumber)
    return data
}

module.exports = {
    setQuestionStartTime,
    addPlayerResponse, 
    getAllResponses,
    getPlayerScore,
    getQuestionResponses,
    getQuestionResponsesSum,
    getFullLeaderboard,
    getTop5PlayersAndScores
}