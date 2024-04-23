import { useEffect, useState } from "react"
import { Flipper, Flipped } from 'react-flip-toolkit'

const LeaderboardScreen = ({leaderboard}) => {

    const [order, setOrder] = useState(leaderboard['prev'])

    useEffect(() => {
        setTimeout(handleReorder, 500)
    }, [order])
    useEffect(() => {
        console.log(leaderboard)
    }, [])

    const handleReorder = () => {
        setOrder(leaderboard['new'])
    }
    return (
        <div className='flex flex-col justify-center items-center h-full'>

            <div className='text-center tracking-wider font-playfair mb-3'>
                <span className='text-4xl font-bold'>Top 5 Leaderboard</span><br />
            </div>
            
            <div className=' w-1/2 mx-auto flex flex-col gap-y-4'>
                <Flipper flipKey={order.map(o => o.player_id).join('')} spring={{}}>
                    {order.map((player, index) => (
                        <Flipped key={player.player_id} flipId={player.player_id}>
                            <div className='flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4'>
                                <span className='text-3xl font-playfair'>#{index+1}</span>
                                <span className='text-3xl font-playfair'>{player.name}</span>
                                <span className='text-4xl font-playfair'>{player.score}</span>
                            </div>
                        </Flipped>
                    ))}
                </Flipper>
            </div>
        </div>
    )
    
}

export default LeaderboardScreen