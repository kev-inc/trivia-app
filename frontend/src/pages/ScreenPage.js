import { useContext, useEffect, useState } from "react"
import { socket } from "../socket/socket"
import useSound from 'use-sound';
import { GameContext, GameState } from "../context/GameContext"
import { questions } from "../data/questions"
import background from '../images/bg-screen.jpg'
import CountdownTimer from "../components/CountdownTimer"

import lobbySfx from '../audio/lobby.webm'
import question1Sfx from '../audio/20s-question1.webm'
import question2Sfx from '../audio/20s-question2.webm'
import leaderboardSfx from '../audio/leaderboard.mp3'
import questionTimesUpSfx from '../audio/questionTimesUp.mp3'
import ResultsChart from "../components/ResultsChart";

const ScreenPage = () => {

    const [playQuestionTimesUp] = useSound(questionTimesUpSfx)
    const [playLobby] = useSound(lobbySfx)
    const [playQuestion1, {stop: stopQuestion1}] = useSound(question1Sfx)
    const [playQuestion2, {stop: stopQuestion2}] = useSound(question2Sfx)
    const [playLeaderboard] = useSound(leaderboardSfx)

    const [players, setPlayers] = useState([])
    const [question, setQuestion] = useState(0)
    const { gameState, setGameState } = useContext(GameContext)

    useEffect(() => {
        socket.on('connect', () => console.log('connecting to server'))
        socket.on('connect_error', err => console.log(err))
        socket.on('connect_failed', err => console.log(err))
        socket.on('screen:updatePlayers', ({ players }) => {
            console.log(players)
            setPlayers(players)
        })
        socket.on('gameStarting', () => {
            setGameState({ state: GameState.STARTING_QUIZ })
        })
        socket.on('gameStarting', () => {
            setGameState({ state: GameState.STARTING_QUIZ })
        })
        socket.on('startingNextQuestion', () => {
            setGameState({ state: GameState.STARTING_NEXT_QUESTION })
        })
        socket.on('showQuestion', () => {
            setGameState({ state: GameState.SHOW_QUESTION })
        })
        socket.on('showAnswers', () => {
            setGameState({ state: GameState.SHOW_ANSWERS })
        })
        socket.on('showResult', () => {
            setGameState({ state: GameState.SHOW_RESULT })
        })
        socket.on('showLeaderboard', () => {
            setGameState({ state: GameState.SHOW_LEADERBOARD })
        })
        socket.on('showFinalResults', () => {
            setGameState({ state: GameState.SHOW_FINAL_RESULTS })
        })
    }, [])

    const transitionToNextState = () => {
        switch (gameState.state) {
            case GameState.NEW:
                socket.emit('startGame')
                break;
            case GameState.STARTING_QUIZ:
                socket.emit('screen:startingNextQuestion')
                break;
            case GameState.STARTING_NEXT_QUESTION:
                socket.emit('screen:showQuestion')
                break;
            case GameState.SHOW_QUESTION:
                socket.emit('screen:showAnswers')
                break;
            case GameState.SHOW_ANSWERS:
                socket.emit('screen:showResult')
                break;
            case GameState.SHOW_RESULT:
                socket.emit('screen:showLeaderboard')
                break;
            case GameState.SHOW_LEADERBOARD:
                if (question < questions.length - 1) {
                    socket.emit('screen:startingNextQuestion')
                } else {
                    socket.emit('screen:showFinalResults')
                }
                setQuestion(question + 1)
                break;
        }
    }

    const renderScreen = () => {
        switch (gameState.state) {
            case GameState.NEW: 
                // playLobby()
                return (
                    <div key={0}>
                        <div className='text-2xl p-4'>Waiting for players... ({players.length})</div>
                        {players.map((p, index) => <span key={index} className='px-4 py-2 bg-sky-500 m-2 rounded text-2xl font-semibold animate__animated animate__bounceIn'>{p.username}</span>)}
                    </div>
                )
            case GameState.STARTING_QUIZ: return <div key={1} className='flex justify-center items-center h-full text-4xl animate__animated animate__zoomIn'>
                <div className='bg-white text-black font-bold w-full py-8 m-8'>
                    Kevin and Jewel's Wedding Trivia!
                </div>
            </div>
            case GameState.STARTING_NEXT_QUESTION:
                // playQuestion2()
                return <div key={2} className='flex justify-center items-center h-full text-4xl'>
                    <div className='flex flex-col items-center justify-center'>
                        <div className='mb-8'>Question is coming up!</div>
                        <div className='animate__animated animate__pulse animate__infinite'>
                            <CountdownTimer onComplete={transitionToNextState} duration={3}/>
                        </div>
                    </div>
                </div>
            case GameState.SHOW_QUESTION: 
                return <div key={3} className='flex flex-col justify-center items-center h-full text-4xl '>
                    <div className='flex-1 w-full px-8'>
                        <div className='bg-white text-black font-bold w-full py-8 animate__animated animate__zoomIn'>{questions[question]['question']}</div>
                    </div>
                    <CountdownTimer onComplete={transitionToNextState} duration={3}/>
                </div>
            case GameState.SHOW_ANSWERS: return <div key={3} className='flex flex-col justify-center items-center h-full text-4xl '>
                    <div className='w-full px-8'>
                        <div className='bg-white text-black font-bold w-full py-8'>{questions[question]['question']}</div>
                    </div>
                    <div className='flex flex-1 w-full p-8'>
                        <div>
                            <CountdownTimer onComplete={transitionToNextState} duration={16} type='sm'/>
                        </div>
                        <div className='flex-1'></div>
                        <div className='text-center'>
                            <span className='text-4xl font-bold'>0</span><br />
                            <span className='text-lg font-semibold'>Answered</span>
                        </div>
                    </div>
                    <div className=' w-full grid grid-cols-2 gap-4 text-3xl p-8 font-semibold text-left'>
                        <div className='bg-red-500 p-4 animate__animated animate__bounceIn'>
                            <span className='mr-2'>▲</span>
                            {questions[question]['answers'][0]}
                        </div>
                        <div className='bg-blue-500 p-4 animate__animated animate__bounceIn'>
                            <span className='mr-2'>◆</span>
                            {questions[question]['answers'][1]}
                        </div>
                        <div className='bg-green-500 p-4 animate__animated animate__bounceIn'>
                            <span className='mr-2'>●</span>
                            {questions[question]['answers'][2]}
                        </div>
                        <div className='bg-yellow-500 p-4 animate__animated animate__bounceIn'>
                            <span className='mr-2'>■</span>
                            {questions[question]['answers'][3]}
                        </div>
                    </div>
                </div>
            
            case GameState.SHOW_RESULT: 
                // stopQuestion2()
                // playQuestionTimesUp()
                return <div key={4} className='flex flex-col justify-center items-center h-full text-4xl '>
                    <div className='w-full px-8'>
                        <div className='bg-white text-black font-bold w-full py-8'>{questions[question]['question']}</div>
                    </div>
                    <div className='flex flex-1 w-full p-8'>
                        <div className='flex-1'>
                            <ResultsChart />
                        </div>
                    </div>
                    <div className=' w-full grid grid-cols-2 gap-4 text-3xl p-8 font-semibold text-left'>
                        <div className={`bg-red-500 p-4 ${questions[question]['answer'] === 0 ? '' : 'opacity-20'}`}>
                            <span className='mr-2'>▲</span>
                            {questions[question]['answers'][0]}
                        </div>
                        <div className={`bg-blue-500 p-4 ${questions[question]['answer'] === 1 ? '' : 'opacity-20'}`}>
                            <span className='mr-2'>◆</span>
                            {questions[question]['answers'][1]}
                        </div>
                        <div className={`bg-green-500 p-4 ${questions[question]['answer'] === 2 ? '' : 'opacity-20'}`}>
                            <span className='mr-2'>●</span>
                            {questions[question]['answers'][2]}
                        </div>
                        <div className={`bg-yellow-500 p-4 ${questions[question]['answer'] === 3 ? '' : 'opacity-20'}`}>
                            <span className='mr-2'>■</span>
                            {questions[question]['answers'][3]}
                        </div>
                    </div>
                </div>
            case GameState.SHOW_LEADERBOARD: 
                // playLeaderboard()
                return <div className='flex justify-center items-center h-full'>
                    <div className=' w-1/2 mx-auto flex flex-col gap-y-4'>
                        {['player1', 'player2', 'player3', 'player4', 'player5'].map((name, index) => (
                            <div key={index} className='bg-white text-black text-3xl font-semibold px-4 py-2'>
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            case GameState.SHOW_FINAL_RESULTS: return <div>Final score</div>
        }
    }

    return (
        <div style={{ backgroundImage: `url(${background})` }} className='h-screen bg-cover bg-center'>
            <div className='container max-w-6xl mx-auto bg-gray-900/70 h-full text-white flex flex-col'>
                <div className='text-center p-6'>
                    <div className="text-2xl tracking-wide">Kevin & Jewel</div>
                    <div className="text-6xl font-semibold">Wedding Trivia</div>
                    <div className="text-2xl tracking-wide">28 July 2024</div>
                </div>
                <div className='text-center flex-1'>
                    {renderScreen()}
                </div>
                <div className='flex flex-row-reverse'>
                    <button className='bg-sky-500 hover:bg-sky-600 active:bg-sky-700 px-4 py-2' onClick={transitionToNextState}>▶</button>
                    {/* <button className='bg-sky-500 hover:bg-sky-600 active:bg-sky-700 px-4 py-2' onClick={transitionToNextState}>◀◀</button> */}
                </div>
            </div>

        </div>
    )
}

export default ScreenPage