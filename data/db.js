const Database = require('better-sqlite3');
const db = new Database(':memory:', { verbose: console.log });

const initialiseDB = () => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS players  (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        active INT DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS player_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id TEXT NOT NULL,
        question_number INT NOT NULL,
        answer_selected INT NOT NULL,
        score INT NOT NULL,
        FOREIGN KEY(player_id) REFERENCES players(id)
    );`)    
}

const resetDB = () => {
    db.exec(`
        DROP TABLE player_responses;
        DROP TABLE players;
    `)
}

module.exports = {
    db,
    initialiseDB,
    resetDB
}