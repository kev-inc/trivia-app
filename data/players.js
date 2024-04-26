const { db } = require("./db");

const addNewPlayer = (id, name) => {
    const info = db.prepare('INSERT INTO players (id, name) VALUES (?,?)').run(id, name)
}

const removePlayer = id => {
    const info = db.prepare('DELETE FROM players WHERE id = ?').run(id)
}

const getPlayerList = () => {
    const rows = db.prepare('SELECT * FROM players').all()
    return rows
}


module.exports = {
    addNewPlayer,
    removePlayer,
    getPlayerList,
}