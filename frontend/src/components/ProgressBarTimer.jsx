import ProgressTimer from 'react-progress-bar-timer';

const ProgressBarTimer = () => {
    return (
        <div>
            <ProgressTimer
                duration={5} 
                started={true}
                color='#0ea5e9'
                barRounded={true}
                // classes={{label: 'opacity: 0'}}
                fontSize={0}
            />
        </div>
    )
}

export default ProgressBarTimer