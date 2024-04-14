const { db } = require("./db");

const addNewPlayer = (id, name) => {
    const info = db.prepare('INSERT INTO players (id, name, active) VALUES (?,?,?)').run(id, name, 1)
}

const removePlayer = id => {
    const info = db.prepare('UPDATE players SET active = 0 WHERE id = ?').run(id)
}

const getPlayerList = () => {
    const rows = db.prepare('SELECT * FROM players WHERE active = 1').all()
    return rows
}


module.exports = {
    addNewPlayer,
    removePlayer,
    getPlayerList,
}