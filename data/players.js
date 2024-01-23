const players = new Map();
const duplicateName = new Map();

const initialisePlayers = () => {
    players.clear()
    duplicateName.clear()
}

const addNewPlayer = (id, name) => {
    if (duplicateName.has(name)) {
        throw new Error('duplicate name')
    }
    players.set(id, {
        name: name,
        score: 0
    })
    duplicateName.set(name, id)
}

const removePlayer = id => {
    const name = players.get(id)
    players.delete(id)
    duplicateName.delete(name)
}

const getPlayerList = () => {
    return [...players.values()].map(p => p.name)
}

const addScoreToPlayer = (id, toAdd) => {
    const p = players.get(id)
    p.score += toAdd
    players.set(id, p)
}

const getAllScoresDesc = () => {
    return [...players.values()].sort((p1, p2) => {
        return p2.score - p1.score
    })
}

module.exports = {
    initialisePlayers,
    addNewPlayer,
    removePlayer,
    getPlayerList,
    addScoreToPlayer,
    getAllScoresDesc,
}