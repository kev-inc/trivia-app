import { GameState } from "../../context/GameContext"
import AnswerCard from "../AnswerCard"
import CountdownTimer from "../CountdownTimer"
import ResultsChart from "../ResultsChart"
import WhiteCard from "../WhiteCard"

const QuestionScreen = ({question, answers, answer, answeredCount, state, labels, responses, transitionToNextState}) => {

    const renderMidSection = () => {
        switch(state) {
            case GameState.SHOW_QUESTION: return
            case GameState.SHOW_ANSWERS: 
                return <div key={1} className='flex flex-1 w-full p-8 animate__animated animate__fadeIn'>
                    <div>
                        <CountdownTimer onComplete={transitionToNextState} duration={16} type='sm'/>
                    </div>
                    <div className='flex-1'></div>
                    <div className='text-center'>
                        <span className='text-4xl font-bold font-playfair'>{answeredCount}</span><br />
                        <span className='text-lg font-semibold font-playfair'>Answered</span>
                    </div>
                </div>
            case GameState.SHOW_RESULT: 
                return <div key={2} className='flex flex-col flex-1 w-full p-8 animate__animated animate__fadeIn'>
                    <div className='flex-1'>
                    <ResultsChart labels={labels} responses={responses}/>
                    </div>
                    <div className='w-1/2 mx-auto flex text-2xl'>
                        <div className='flex-1 bg-red-500 rounded mx-2 my-1'>{labels[0]}</div>
                        <div className='flex-1 bg-blue-500 rounded mx-2 my-1'>{labels[1]}</div>
                        <div className='flex-1 bg-green-500 rounded mx-2 my-1'>{labels[2]}</div>
                        <div className='flex-1 bg-yellow-500 rounded mx-2 my-1'>{labels[3]}</div>
                        
                    </div>
                   
                </div>

        }
    }
    const renderAnswerSection = () => {
        switch(state) {
            case GameState.SHOW_QUESTION:
                return <CountdownTimer onComplete={transitionToNextState} duration={3}/>
            case GameState.SHOW_ANSWERS:
                return <div className=' w-full grid grid-cols-2 gap-4 text-3xl p-8 font-semibold text-left'>
                    <AnswerCard color='red' animated>
                        <span className='mr-2'>A.</span>
                        {answers[0]}
                    </AnswerCard>
                    <AnswerCard color='blue' animated>
                        <span className='mr-2'>B.</span>
                        {answers[1]}
                    </AnswerCard>
                    <AnswerCard color='green' animated>
                        <span className='mr-2'>C.</span>
                        {answers[2]}
                    </AnswerCard>
                    <AnswerCard color='yellow' animated>
                        <span className='mr-2'>D.</span>
                        {answers[3]}
                    </AnswerCard>
                </div>
            case GameState.SHOW_RESULT:
                return <div className=' w-full grid grid-cols-2 gap-4 text-3xl p-8 font-semibold text-left'>
                    <AnswerCard color='red' translucent={answer !== 0}>
                        <span className='mr-2'>A.</span>
                        {answers[0]}
                    </AnswerCard>
                    <AnswerCard color='blue' translucent={answer !== 1}>
                        <span className='mr-2'>B.</span>
                        {answers[1]}
                    </AnswerCard>
                    <AnswerCard color='green' translucent={answer !== 2}>
                        <span className='mr-2'>C.</span>
                        {answers[2]}
                    </AnswerCard>
                    <AnswerCard color='yellow' translucent={answer !== 3}>
                        <span className='mr-2'>D.</span>
                        {answers[3]}
                    </AnswerCard>
                </div>
        }
    }

    return (
        <div className='flex flex-col justify-center items-center h-full text-4xl'>
            <div className='flex-1 w-full p-8 font-playfair animate__animated animate__fadeIn'>
                {question}
            </div>
            {renderMidSection()}
            {renderAnswerSection()}
            
        </div>
    )
}

export default QuestionScreen