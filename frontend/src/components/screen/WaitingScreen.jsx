import qr from '../../images/qr.png'

const WaitingScreen = ({players}) => (
    <div key={0}>
        <div className='my-6'>
            <span className='text-4xl p-4 font-playfair tracking-wider bg-white text-black rounded'>Scan to join, or go to</span>
        </div>
        <div className='my-6'>
            <span className='text-4xl p-4 font-playfair font-bold tracking-wider bg-white text-black rounded'>wedding.kevincxy.com</span>
        </div>
        <div className='flex justify-center'>
            <img className='h-80' src={qr} alt="qr"/>
        </div>
        <div className='flex justify-center'>
            <span className='text-4xl mt-4 p-4 font-playfair font-bold tracking-wider bg-white text-black rounded mb-4'>Waiting for players... ({players.length})</span>
        </div>
        <div className='flex flex-row-reverse flex-wrap-reverse justify-center'>
            {players.slice(players.length - 30 < 0 ? 0 : players.length - 30,players.length).map((p, index) => <span key={index} className='m-2 p-2 text-4xl font-playfair bg-white text-black rounded animate__animated animate__bounceIn'>{p.name}</span>)}
        </div>
    </div>
)

export default WaitingScreen