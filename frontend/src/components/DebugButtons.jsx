import { useContext, useEffect } from "react"
import { GameContext, GameState } from "../context/GameContext"
import { socket } from "../socket/socket"

const DebugButtons = () => {

    const {gameState} = useContext(GameContext)

    const startGame = () => {
        socket.emit('startGame')
    }

    const printState = () => {
        console.log(gameState)
    }

    return <div className='fixed bottom-0 left-0 right-0 flex gap-x-2 text-xs'>
        <button className='border bg-white' onClick={startGame}>Start Game</button>
        <button className='border bg-white' onClick={printState}>Print State</button>
    </div>
}
export default DebugButtons