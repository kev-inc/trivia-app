const { db } = require("./db");

const addNewPlayer = (id, name) => {
    try {
        // const info = db.prepare('INSERT INTO players (id, name) VALUES (?,?)').run(id, name)
        const info = db.prepare('INSERT INTO player_responses (player_id, player_name, question_number, answer_selected, score) VALUES (?,?,?,?,?)')
            .run(id, name, -1, 0, 0)
    } catch (e) {
        console.log('Error adding player', e)
    }
}

const removePlayer = id => {
    try {
        const info = db.prepare('DELETE FROM player_responses WHERE id = ? AND question_number = -1').run(id)
    } catch (e) {
        console.log('Error removing player', e)
    }
}

const getPlayerList = () => {
    try {
        const rows = db.prepare('SELECT player_id as id, player_name as name FROM player_responses WHERE question_number = -1').all()
        return rows
    } catch (e) {
        console.log('Error getting player list', e)
    }
}


module.exports = {
    addNewPlayer,
    removePlayer,
    getPlayerList,
}