const LeaderboardScreen = () => (
    <div className='flex justify-center items-center h-full'>
        <div className=' w-1/2 mx-auto flex flex-col gap-y-4'>
            {[
                {name: 'apple', score: 23},
                {name: 'banana', score: 16},
                {name: 'coconut', score: 14},
                {name: 'durian', score: 13},
                {name: 'emily', score: 5},
            ].map((player, index) => (
                    <div key={index} className='flex justify-between items-center px-8 py-2 border-white rounded border-4'>
                        <span className='text-3xl font-playfair'>{player.name}</span>
                        <span className='text-4xl'>{player.score}</span>
                    </div>
            ))}
        </div>
    </div>
)

export default LeaderboardScreen