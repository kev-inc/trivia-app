const { questionList } = require("./questions")
const { getFullLeaderboard, getTop5PlayersAndScores, setQuestionStartTime, getQuestionResponses } = require("./responses")

const GameState = {
    NEW: 0, // For lobby and screen
    WAITING: 1, // For lobby, after player enters name and is waiting for game to start
    STARTING_QUIZ: 2, // For lobby and screen. Both shows quiz name.
    STARTING_NEXT_QUESTION: 3, // For lobby and screen, show 3s timer before transition to SHOW_QUESTION
    SHOW_QUESTION: 4, // For lobby and screen, show question
    SHOW_ANSWERS: 5, // For lobby and screen, show answers below the question.
    ANSWERED: 6, // For lobby, when player has submitted an answer
    SHOW_RESULT: 7, // For lobby and screen, stop accepting answers, show the correct answer, and answer breakdown
    SHOW_LEADERBOARD: 8, // For screen, show top 5, for lobby, show current position
    SHOW_FINAL_RESULTS_SHOW_0: 9, // Show none
    SHOW_FINAL_RESULTS_SHOW_1: 10, // Show 3rd
    SHOW_FINAL_RESULTS_SHOW_2: 11, // Show 2nd
    SHOW_FINAL_RESULTS_SHOW_3: 12, // Show 1st
}

const gamestate = {
    state: GameState.NEW,
    questionNumber: 0,
    answeredCount: 0,
    currentQuestionResponses: [],
    leaderboard: {},
    players: [],
}

const resetGamestate = () => {
    gamestate.state = GameState.NEW
    gamestate.questionNumber = 0
    gamestate.answeredCount = 0
    gamestate.currentQuestionResponses = []
    gamestate.leaderboard = {}
    gamestate.players = []
}

const handleTransitionToNextState = () => {
    switch(gamestate.state) {
        case GameState.NEW:
            gamestate.state = GameState.STARTING_QUIZ
            break;
        case GameState.STARTING_QUIZ:
            gamestate.state = GameState.STARTING_NEXT_QUESTION
            gamestate.answeredCount = 0
            gamestate.currentQuestionResponses = [0,0,0,0]
            break
        case GameState.STARTING_NEXT_QUESTION:
            setQuestionStartTime(gamestate.questionNumber, Date.now())
            gamestate.state = GameState.SHOW_QUESTION
            break
        case GameState.SHOW_QUESTION:
            gamestate.state = GameState.SHOW_ANSWERS
            break
        case GameState.SHOW_ANSWERS:
            const responses = getQuestionResponses(gamestate.questionNumber)
            const response = []
            responses.forEach(r => {
                response[r.answer_selected] = r.count
            })
            gamestate.currentQuestionResponses = response
            gamestate.state = GameState.SHOW_RESULT
            console.log(gamestate)
            break
        case GameState.SHOW_RESULT:
            const full = getFullLeaderboard(gamestate.questionNumber)
            const prev = getTop5PlayersAndScores(gamestate.questionNumber - 1)
            const latest = getTop5PlayersAndScores(gamestate.questionNumber)
            gamestate.leaderboard = {prev, new: latest, full}
            if (gamestate.questionNumber < questionList.length - 1) {
                gamestate.state = GameState.SHOW_LEADERBOARD
            } else {
                gamestate.state = GameState.SHOW_FINAL_RESULTS_SHOW_0
            }
            break
        case GameState.SHOW_LEADERBOARD:
            if (gamestate.questionNumber < questionList.length - 1) {
                gamestate.state = GameState.STARTING_NEXT_QUESTION
                gamestate.answeredCount = 0
                gamestate.questionNumber = gamestate.questionNumber + 1
            }
            break
        case GameState.SHOW_FINAL_RESULTS_SHOW_0:
            gamestate.state = GameState.SHOW_FINAL_RESULTS_SHOW_1
            break
        case GameState.SHOW_FINAL_RESULTS_SHOW_1:
            gamestate.state = GameState.SHOW_FINAL_RESULTS_SHOW_2
            break
        case GameState.SHOW_FINAL_RESULTS_SHOW_2:
            gamestate.state = GameState.SHOW_FINAL_RESULTS_SHOW_3
            break
        case GameState.SHOW_FINAL_RESULTS_SHOW_3:
            gamestate.state = GameState.SHOW_LEADERBOARD
            break
    }
}

module.exports = {
    GameState,
    gamestate,
    handleTransitionToNextState,
    resetGamestate
}