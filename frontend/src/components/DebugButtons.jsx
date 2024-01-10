import { useContext } from "react"
import { GameContext, GameState } from "../context/GameContext"

const DebugButtons = () => {


    const { gameState, setGameState } = useContext(GameContext)

    const startGame = () => {
        if (gameState.state === GameState.WAITING) {
            setGameState({...gameState, state: GameState.STARTING_NEXT_QUESTION})
        }
    }

    return <div className='fixed bottom-0 left-0 right-0 flex gap-x-2 text-xs'>
        <button className='border bg-white' onClick={startGame}>Start Game</button>
    </div>
}
export default DebugButtons