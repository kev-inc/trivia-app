import CountdownTimer from "../CountdownTimer"

const StartingQuestionScreen = ({transitionToNextState}) => (
    <div key={2} className='flex justify-center items-center h-full text-4xl'>
        <div className='flex flex-col items-center justify-center'>
            <div className='mb-8 font-playfair'>Question is coming up!</div>
            <div className='animate__animated animate__pulse animate__infinite'>
                <CountdownTimer onComplete={transitionToNextState} duration={3}/>
            </div>
        </div>
    </div>
)

export default StartingQuestionScreen