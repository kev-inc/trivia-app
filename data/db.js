const Database = require('better-sqlite3');
const db = new Database(':memory:', { verbose: console.log });

const initialiseDB = () => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS players  (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
    );
    CREATE TABLE IF NOT EXISTS player_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id TEXT NOT NULL,
        player_name TEXT NOT NULL,
        question_number INT NOT NULL,
        answer_selected INT NOT NULL,
        score INT NOT NULL
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