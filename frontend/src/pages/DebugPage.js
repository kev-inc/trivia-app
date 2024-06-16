import { useEffect, useState } from 'react'
import { socket } from '../socket/socket'

const DebugPage = () => {

    const [state, setState] = useState()

    useEffect(() => {
	socket.on('connect', () => console.log('connected'))
	socket.on('updateState', ({gamestate}) => {
            console.log(gamestate)
	    setState(gamestate)
	})
    }, [])

    return (
        <div>
	    <div>Debug Panel</div>
	    <div>State: {state?.state}</div>
	    <div>Question Number: {state?.questionNumber}</div>
	    <div>Answered Count: {state?.answeredCount}</div>
	    <div>Players</div>
	    {state?.players.map((player, index) => (
                <div>{player.id} {player.name}</div>
	    ))}
	    <div>Leaderboard</div>
	    {state?.leaderboard?.full?.map((player, index) => (
		<pre>{player}</pre>
	    ))}
	</div>
    )

}

export default DebugPage
