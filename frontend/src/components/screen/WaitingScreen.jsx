import qr from '../../images/qr.png'

const WaitingScreen = ({players}) => (
    <div key={0}>
        <div className='flex justify-center'>
            <span className='text-2xl p-4 font-playfair font-semibold tracking-wider bg-white text-black rounded mb-4'>Scan me to join, or go to https://knj-trivia.vercel.app/</span>
        </div>
        <div className='flex justify-center'>
            <img className='h-64' src={qr} alt="qr"/>
        </div>
        <div className='text-2xl mt-8 p-4 font-playfair tracking-wider'>Waiting for players... ({players.length})</div>
        <div className='flex flex-row-reverse flex-wrap justify-center'>
            {players.slice(0, 30).map((p, index) => <span key={index} className='m-2 text-2xl font-playfair underline animate__animated animate__bounceIn'>{p.name}</span>)}
        </div>
    </div>
)

export default WaitingScreen