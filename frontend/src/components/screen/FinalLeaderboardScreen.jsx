import { useState } from "react";

const FinalLeaderboardScreen = ({leaderboard, state, transitionToNextState}) => {

    const [order, setOrder] = useState(leaderboard['new'])

    // const [revealed, setRevealed] = useState(leaderboard['new'].length)

    // const revealNext = () => {
	// if (revealed < 0) {
    //         transitionToNextState()
	// }
    //     setRevealed((prevState) => prevState - 1)
    // }

    const displayWinner = (position) => {
        switch (state) {
            case GameState.SHOW_FINAL_RESULTS_SHOW_0:
                return position >= 3
            case GameState.SHOW_FINAL_RESULTS_SHOW_1:
                return position >= 2
            case GameState.SHOW_FINAL_RESULTS_SHOW_2:
                return position >= 1
            case GameState.SHOW_FINAL_RESULTS_SHOW_3:
                return position >= 0
            default: return false
        }
    }

    return (
        <div className='flex flex-col justify-center items-center h-full'>

            <div className='text-center tracking-wider font-playfair mb-3'>
                <span className='text-4xl font-bold cursor-pointer'>Final Leaderboard</span><br />
            </div>
            
            <div className=' w-1/2 mx-auto flex flex-col gap-y-4'>
                <div key={0} className={`${displayWinner(0) ? '' : 'hidden'} flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4 animate__animated animate__tada`}>
                    <span className='text-3xl font-playfair'>#1</span>
                    <span className='text-3xl font-playfair'>{order.length >= 1 ? order[0].player_name : ''}</span>
                    <span className='text-4xl font-playfair'>{order.length >= 1 ? order[0].score : ''}</span>
                </div>

                <div key={1} className={`${displayWinner(1) ? '' : 'hidden'} flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4 animate__animated animate__tada`}>
                    <span className='text-3xl font-playfair'>#2</span>
                    <span className='text-3xl font-playfair'>{order.length >= 2 ? order[1].player_name : ''}</span>
                    <span className='text-4xl font-playfair'>{order.length >= 2 ? order[1].score : ''}</span>
                </div>

                <div key={2} className={`${displayWinner(2) ? '' : 'hidden'} flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4 animate__animated animate__tada`}>
                    <span className='text-3xl font-playfair'>#3</span>
                    <span className='text-3xl font-playfair'>{order.length >= 3 ? order[2].player_name : ''}</span>
                    <span className='text-4xl font-playfair'>{order.length >= 3 ? order[2].score : ''}</span>
                </div>
            </div>
        </div>
    )
}

export default FinalLeaderboardScreen
