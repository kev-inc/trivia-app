import { GameState } from "../../context/GameContext"
import AnswerCard from "../AnswerCard"
import CountdownTimer from "../CountdownTimer"
import ResultsChart from "../ResultsChart"
import WhiteCard from "../WhiteCard"

const QuestionScreen = ({question, answers, answer, answeredCount, state, labels, responses, transitionToNextState}) => {

    const renderMidSection = () => {
        switch(state) {
            case GameState.SHOW_QUESTION: return
            case GameState.SHOW_QUESTION_OPTIONS: 
                return <div key={1} className='flex flex-1 w-full p-8 animate__animated animate__fadeIn'>
                    <div>
                        <CountdownTimer onComplete={transitionToNextState} duration={20} type='sm'/>
                    </div>
                    <div className='flex-1'></div>
                    <div className='text-center'>
                        <span className='text-6xl font-bold font-playfair'>{answeredCount}</span><br />
                        <span className='text-4xl font-semibold font-playfair'>Answered</span>
                    </div>
                </div>
            case GameState.SHOW_CORRECT_ANSWER: 
                return <div key={2} className='flex flex-col flex-1 w-full p-8 animate__animated animate__fadeIn'>
                    <div className='flex-1'>
                    <ResultsChart labels={labels} responses={responses}/>
                    </div>
                    <div className='w-1/2 mx-auto flex text-2xl'>
                        <div className='flex-1 bg-red-500 font-bold text-4xl rounded mx-2 my-1'>{labels[0]}</div>
                        <div className='flex-1 bg-blue-500 font-bold text-4xl rounded mx-2 my-1'>{labels[1]}</div>
                        <div className='flex-1 bg-green-500 font-bold text-4xl rounded mx-2 my-1'>{labels[2]}</div>
                        <div className='flex-1 bg-yellow-500 font-bold text-4xl rounded mx-2 my-1'>{labels[3]}</div>
                        
                    </div>
                   
                </div>

        }
    }
    const renderAnswerSection = () => {
        switch(state) {
            case GameState.SHOW_QUESTION:
                return <CountdownTimer onComplete={transitionToNextState} duration={3}/>
            case GameState.SHOW_QUESTION_OPTIONS:
                return <div className=' w-full grid grid-cols-2 gap-4 text-5xl font-bold p-8 font-semibold text-left'>
                    <AnswerCard color='red' animated>
                        <div className='py-4'>
                            <span className='mr-2'>A.</span>
                            {answers[0]}
                        </div>
                    </AnswerCard>
                    <AnswerCard color='blue' animated>
                        <div className='py-4'>
                            <span className='mr-2'>B.</span>
                            {answers[1]}
                        </div>
                    </AnswerCard>
                    <AnswerCard color='green' animated>
                        <div className='py-4'>
                            <span className='mr-2'>C.</span>
                            {answers[2]}
                        </div>
                    </AnswerCard>
                    <AnswerCard color='yellow' animated>
                        <div className='py-4'>
                            <span className='mr-2'>D.</span>
                            {answers[3]}
                        </div>
                    </AnswerCard>
                </div>
            case GameState.SHOW_CORRECT_ANSWER:
                return <div className=' w-full grid grid-cols-2 gap-4 text-5xl font-bold p-8 text-left'>
                    <AnswerCard color='red' translucent={answer !== 0}>
                        <div className='py-4'>
                            <span className='mr-2'>A.</span>
                            {answers[0]}
                        </div>
                    </AnswerCard>
                    <AnswerCard color='blue' translucent={answer !== 1}>
                        <div className='py-4'>
                            <span className='mr-2'>B.</span>
                            {answers[1]}
                        </div>
                    </AnswerCard>
                    <AnswerCard color='green' translucent={answer !== 2}>
                        <div className='py-4'>
                            <span className='mr-2'>C.</span>
                            {answers[2]}
                        </div>
                    </AnswerCard>
                    <AnswerCard color='yellow' translucent={answer !== 3}>
                        <div className='py-4'>
                            <span className='mr-2'>D.</span>
                            {answers[3]}
                        </div>
                    </AnswerCard>
                </div>
        }
    }

    return (
        <div className='flex flex-col justify-center items-center h-full text-7xl'>
            <div className='flex-1 w-full p-8 font-playfair font-bold animate__animated animate__fadeIn'>
                {question}
            </div>
            {renderMidSection()}
            {renderAnswerSection()}
            
        </div>
    )
}

export default QuestionScreen