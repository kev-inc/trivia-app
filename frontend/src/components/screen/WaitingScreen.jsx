import qr from '../../images/qr.png'

const WaitingScreen = ({players}) => (
    <div key={0}>
        <div className='flex justify-center'>
            <span className='text-2xl p-4 font-playfair font-semibold tracking-wider bg-white text-black rounded mb-4'>Scan me to join, or go to https://knj-trivia.pages.dev/</span>
        </div>
        <div className='flex justify-center'>
            <img className='h-64' src={qr} alt="qr"/>
        </div>
        <div className='flex justify-center'>
            <span className='text-2xl mt-8 p-4 font-playfair tracking-wider bg-white text-black rounded mb-4'>Waiting for players... ({players.length})</span>
        </div>
        <div className='flex flex-row-reverse flex-wrap-reverse justify-center'>
            {players.slice(players.length - 30 < 0 ? 0 : players.length - 30,players.length).map((p, index) => <span key={index} className='m-2 px-2 py-1 text-2xl font-playfair bg-white text-black rounded underline animate__animated animate__bounceIn'>{p.name}</span>)}
        </div>
    </div>
)

export default WaitingScreen