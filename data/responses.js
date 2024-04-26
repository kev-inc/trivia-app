const { db } = require("./db")

const questionStartTime = new Map()
const setQuestionStartTime = (questionNum, unixtime) => {
    questionStartTime[questionNum] = unixtime
}

const addPlayerResponse = (playerId, playerName, questionNo, answerNo, isAnswerCorrect) => {
    const points = Math.floor((questionStartTime[questionNo] + (15 * 1000) - Date.now()) / 100)
    const info = db.prepare('INSERT INTO player_responses (player_id, player_name, question_number, answer_selected, score) VALUES (?,?,?,?,?)')
        .run(playerId, playerName, questionNo, answerNo, isAnswerCorrect ? points : 0)
    // if adding a response for a player that is not in the list, create that player first, then try again
}

const getAllResponses = () => {
    const rows = db.prepare('SELECT * FROM player_responses').all()
    return rows
}

// const getPlayerScore = (playerName, questionNumber) => {
//     // Get player score until question number
//     const data = db.prepare('SELECT SUM(score) AS score FROM player_responses WHERE player_name = ? AND question_number <= ?').get(playerName, questionNumber)
//     return data['score']
// }

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
    const data = db.prepare('SELECT player_name, SUM(score) AS score FROM player_responses WHERE question_number <= ? GROUP BY player_name ORDER BY score DESC').all(questionNumber)
    return data
}

const getTop5PlayersAndScores = (questionNumber) => {
    const data = db.prepare('SELECT player_name, SUM(score) AS score FROM player_responses WHERE question_number <= ? GROUP BY player_name ORDER BY score DESC LIMIT 5').all(questionNumber)
    return data
}

module.exports = {
    setQuestionStartTime,
    addPlayerResponse, 
    getAllResponses,
    // getPlayerScore,
    getQuestionResponses,
    getQuestionResponsesSum,
    getFullLeaderboard,
    getTop5PlayersAndScores
}