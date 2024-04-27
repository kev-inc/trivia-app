const { db } = require("./db");

const addNewPlayer = (id, name) => {
    try {
        const info = db.prepare('INSERT INTO players (id, name) VALUES (?,?)').run(id, name)
    } catch (e) {
        console.log('Error adding player', e)
    }
}

const removePlayer = id => {
    try {
        const info = db.prepare('DELETE FROM players WHERE id = ?').run(id)
    } catch (e) {
        console.log('Error removing player', e)
    }
}

const getPlayerList = () => {
    try {
        const rows = db.prepare('SELECT * FROM players').all()
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