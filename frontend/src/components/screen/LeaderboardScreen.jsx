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
        <div className='flex flex-col justify-center items-center'>

            <div className='text-center tracking-wider font-playfair mb-4'>
                <span className='text-6xl font-bold'>Top 5 Leaderboard</span><br />
            </div>
            
            <div className=' w-3/4 mx-auto flex flex-col gap-y-4 text-6xl font-playfair font-bold'>
                <Flipper flipKey={order.map(o => o.player_name).join('')} spring={{}}>
                    {order.map((player, index) => (
                        <Flipped key={player.player_name} flipId={player.player_name}>
                            <div className='flex mb-3 justify-between items-center px-8 py-4 border-grey bg-white text-black rounded border-4'>
                                <span>#{index+1}</span>
                                <span>{player.player_name}</span>
                                <span>{player.score}</span>
                            </div>
                        </Flipped>
                    ))}
                </Flipper>
            </div>
        </div>
    )
    
}

export default LeaderboardScreen