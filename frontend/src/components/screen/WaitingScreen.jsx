const WaitingScreen = ({players}) => (
    <div key={0}>
        <div className='text-2xl mt-8 p-4 font-playfair tracking-wider'>Waiting for players... ({players.length})</div>
        {players.map((p, index) => <span key={index} className='m-2 text-2xl font-playfair underline animate__animated animate__bounceIn'>{p.name}</span>)}
    </div>
)

export default WaitingScreen