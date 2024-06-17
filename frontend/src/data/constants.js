const SOCKET_MESSAGES = {

    // Client to server
    C2S: {
        DISCONNECT: 'disconnect',
        JOIN_GAME: 'joinGame',
        REQUEST_NEXT_STATE: 'requestNextState',
        USER_ANSWERED_QUESTION: 'userAnsweredQuestion',
        RESET_GS: 'resetgs'
    },
    // Server to client
    S2C: {
        CONNECT: 'connect',
        CONNECTION_ERROR: 'connect_error',
        JOINED_GAME: 'joinedGame',
        JOIN_GAME_ERROR: 'joinGameError',
        UPDATE_PLAYERS: 'updatePlayers',
        UPDATE_STATE: 'updateState',
        UPDATE_ANSWERED_COUNT: 'updateAnsweredCount',
        USER_ANSWERED: 'userAnswered'
    },

}

module.exports = SOCKET_MESSAGES
