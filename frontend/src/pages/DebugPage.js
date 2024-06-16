import { useContext, useEffect, useState } from 'react'
import { socket } from '../socket/socket'
import { LoadingContext } from '../context/LoadingContext'
import { getGameStateString } from '../context/GameContext'

const DebugPage = () => {

	const { displaySpinner, setDisplaySpinner } = useContext(LoadingContext)

	const [state, setState] = useState()

	useEffect(() => {
		socket.on('connect', () => setDisplaySpinner(false))
		socket.on('updateState', ({ gamestate }) => {
			console.log(gamestate)
			setState(gamestate)
		})
		socket.on('updatePlayers', ({ players }) => {
			setState((prevState) => ({
				...prevState,
				players
			}))
		})
	}, [])

	const resetgs = () => {
		if (window.confirm('Are you sure you want to reset the gamestate?')) {
			socket.emit('resetgs')
		}
	}

	const transitionNextState = () => {
		socket.emit('requestNextState')
	}

	const Section = ({ title, children }) => (
		<div className='border rounded-lg shadow px-4 py-2 mx-2 my-4'>
			<div className='font-bold'>{title}</div>
			{children}
		</div>
	)

	return (
		<div>
			<Section title='Debug Panel'></Section>
			<Section title=''>
				<button onClick={transitionNextState} className='bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-4 py-2 rounded-lg text-white'>Next State</button>
			</Section>
			<Section title='State'>{getGameStateString(state?.state)}</Section>
			<Section title='Question Number'>{state?.questionNumber + 1}</Section>
			<Section title='Answered Count'>{state?.answeredCount}</Section>
			<Section title='Players'>

				<table class="table-auto">
					<thead>
						<tr>
							<th className='border px-2'>ID</th>
							<th className='border px-2'>Player</th>
						</tr>
					</thead>
					<tbody>
						{state?.players.map((player, index) => (
							<tr key={index}>
								<td className='border px-2'>{player.id}</td>
								<td className='border px-2'>{player.name}</td>
							</tr>
						))}
					</tbody>
				</table>
			</Section>
			<Section title='Leaderboard'>
				<table class="table-auto">
					<thead>
						<tr>
							<th className='border px-2'>#</th>
							<th className='border px-2'>Player</th>
							<th className='border px-2'>Score</th>
						</tr>
					</thead>
					<tbody>
						{state?.leaderboard?.full?.map((player, index) => (
							<tr key={index}>
								<td className='border px-2'>{index + 1}</td>
								<td className='border px-2'>{player.player_name}</td>
								<td className='border px-2'>{player.score}</td>
							</tr>
						))}
					</tbody>
				</table>
			</Section>

			<Section title=''>
				<button onClick={resetgs} className='bg-blue-500 hover:bg-blue-600 active:bg-blue-700 px-2 py-1 rounded-lg text-white'>Reset Game</button>
			</Section>
		</div>
	)

}

export default DebugPage
