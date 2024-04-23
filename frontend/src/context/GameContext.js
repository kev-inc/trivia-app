import { createContext } from "react";

export const GameState = {
    NEW: 0, // For lobby and screen
    WAITING: 1, // For lobby, after player enters name and is waiting for game to start
    STARTING_QUIZ: 2, // For lobby and screen. Both shows quiz name.
    STARTING_NEXT_QUESTION: 3, // For lobby and screen, show 3s timer before transition to SHOW_QUESTION
    SHOW_QUESTION: 4, // For lobby and screen, show question
    SHOW_ANSWERS: 5, // For lobby and screen, show answers below the question.
    ANSWERED: 6, // For lobby, when player has submitted an answer
    SHOW_RESULT: 7, // For lobby and screen, stop accepting answers, show the correct answer, and answer breakdown
    SHOW_LEADERBOARD: 8, // For screen, show top 5, for lobby, show current position
    SHOW_FINAL_RESULTS: 9,
}

export const GameContext = createContext({
    name: '',
    state: GameState.NEW
})