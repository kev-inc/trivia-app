import { useState } from "react";

const FinalLeaderboardScreen = ({leaderboard}) => {

    const [order, setOrder] = useState(leaderboard['new'])

    const [revealed, setRevealed] = useState(leaderboard['new'].length)

    const revealNext = () => {
        setRevealed((prevState) => prevState - 1)
    }

    return (
        <div className='flex flex-col justify-center items-center h-full'>

            <div className='text-center tracking-wider font-playfair mb-3'>
                <span className='text-4xl font-bold cursor-pointer' onClick={revealNext}>Final Leaderboard</span><br />
            </div>
            
            <div className=' w-1/2 mx-auto flex flex-col gap-y-4'>
                {order.map((player, index) => (
                    <div key={index} className={`${index < revealed ? 'hidden' : ''} flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4 animate__animated animate__tada`}>
                        <span className='text-3xl font-playfair'>#{index+1}</span>
                        <span className='text-3xl font-playfair'>{player.name}</span>
                        <span className='text-4xl font-playfair'>{player.score}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FinalLeaderboardScreen