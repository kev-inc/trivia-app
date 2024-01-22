import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const CountdownTimer = ({duration, type = 'lg', onComplete }) => {
    const lg = <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={'#fff'}
        // colorsTime={[3, 2, 1, 0]}
        trailStrokeWidth={0}
        strokeWidth={20}
        onComplete={onComplete}
    >
        {({ remainingTime }) => <span className='font-bold text-6xl'>{remainingTime}</span>}
    </CountdownCircleTimer>
    const sm = <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={'#fff'}
        // colorsTime={[3, 2, 1, 0]}
        trailStrokeWidth={0}
        strokeWidth={8}
        onComplete={onComplete}
        size={60}
    >
        {({ remainingTime }) => <span className='font-semibold text-xl'>{remainingTime}</span>}
    </CountdownCircleTimer>
    const hidden = <CountdownCircleTimer
        isPlaying
        duration={duration}
        colors={'#fff'}
        // colorsTime={[3, 2, 1, 0]}
        trailStrokeWidth={0}
        strokeWidth={0}
        onComplete={onComplete}
        size={0}
    >
        {({ remainingTime }) => <span></span>}
    </CountdownCircleTimer>
    switch(type) {
        case 'lg': return lg
        case 'sm': return sm
        case 'hidden': return hidden
    }
}

export default CountdownTimer