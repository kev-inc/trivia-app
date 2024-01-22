import { createContext } from "react";

export const GameState = {
    NEW: 0,
    WAITING: 1,
    STARTING_QUIZ: 2,
    STARTING_NEXT_QUESTION: 3,
    SHOW_QUESTION: 4,
    SHOW_ANSWERS: 5,
    ANSWERED: 6,
    SHOW_RESULT: 7,
    SHOW_LEADERBOARD: 8,
    SHOW_FINAL_RESULTS: 9,
}

export const GameContext = createContext({
    name: '',
    state: GameState.NEW
})