import { useContext, useEffect, useMemo, useState } from "react"
import { socket } from "../socket/socket"
import useSound from 'use-sound';
import { GameContext, GameState } from "../context/GameContext"
import { questions } from "../data/questions"
import background from '../images/bg-screen1.JPG'
import CountdownTimer from "../components/CountdownTimer"

import lobbySfx from '../audio/lobby.webm'
import question1Sfx from '../audio/20s-question1.webm'
import question2Sfx from '../audio/20s-question2.webm'
import leaderboardSfx from '../audio/leaderboard.mp3'
import questionTimesUpSfx from '../audio/questionTimesUp.mp3'
import ResultsChart from "../components/ResultsChart";
import AnswerCard from "../components/AnswerCard";
import WhiteCard from "../components/WhiteCard";
import WaitingScreen from "../components/screen/WaitingScreen";
import StartingQuizScreen from "../components/screen/StartingQuizScreen";
import StartingQuestionScreen from "../components/screen/StartingQuestionScreen";
import QuestionScreen from "../components/screen/QuestionScreen";
import LeaderboardScreen from "../components/screen/LeaderboardScreen";

const ScreenPage = () => {

    const [playQuestionTimesUp, {sound: soundQuestionTimesUp}] = useSound(questionTimesUpSfx)
    const [playLobby, {stop: stopLobby}] = useSound(lobbySfx)
    const [playQuestion1, {stop: stopQuestion1}] = useSound(question1Sfx)
    const [playQuestion2, {sound: soundQ2, stop: stopQ2}] = useSound(question2Sfx)
    const [playLeaderboard, {sound: soundLeaderboard}] = useSound(leaderboardSfx)

    const [players, setPlayers] = useState([])
    const [question, setQuestion] = useState(0)
    const [responses, setResponses] = useState()
    const [leaderboard, setLeaderboard] = useState()
    const [answeredCount, setAnsweredCount] = useState()
    const { gameState, setGameState } = useContext(GameContext)

    useEffect(() => {
        socket.on('connect', () => console.log('connected to server'))
        socket.on('screen:updatePlayers', ({ players }) => {
            console.log(players)
            setPlayers(players)
        })
        socket.on('gameStarting', () => {
            setGameState({ state: GameState.STARTING_QUIZ })
        })
        socket.on('startingNextQuestion', () => {
            setGameState({ state: GameState.STARTING_NEXT_QUESTION })
            setAnsweredCount(0)
        })
        socket.on('showQuestion', () => {
            setGameState({ state: GameState.SHOW_QUESTION })
        })
        socket.on('showAnswers', () => {
            setGameState({ state: GameState.SHOW_ANSWERS })
        })
        socket.on('showResult', ({responses: resp}) => {
            setGameState({ state: GameState.SHOW_RESULT })
            setResponses(resp)
        })
        socket.on('showLeaderboard', ({leaderboard: lb}) => {
            setGameState({ state: GameState.SHOW_LEADERBOARD })
            console.log(lb)
            setLeaderboard(lb)
        })
        socket.on('showFinalResults', ({leaderboard: lb}) => {
            setGameState({ state: GameState.SHOW_FINAL_RESULTS })
            setLeaderboard(lb)
        })
        socket.on('updateAnsweredCount', ({answered}) => {
            setAnsweredCount(answered)
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
                socket.emit('screen:showQuestion', {question})
                break;
            case GameState.SHOW_QUESTION:
                socket.emit('screen:showAnswers')
                break;
            case GameState.SHOW_ANSWERS:
                socket.emit('screen:showResult', {question})
                break;
            case GameState.SHOW_RESULT:
                socket.emit('screen:showLeaderboard', {question})
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

    const playAudio = useMemo(() => {
        switch (gameState.state) {
            case GameState.STARTING_NEXT_QUESTION:
                if (!soundQ2.playing()) {
                    playQuestion2()
                }
                return 
            case GameState.SHOW_RESULT:
                if (soundQ2.playing()) {
                    stopQ2()
                }
                if (!soundQuestionTimesUp.playing()) {
                    playQuestionTimesUp()
                }
                return
            case GameState.SHOW_LEADERBOARD:
                if (!soundLeaderboard.playing()) {
                    playLeaderboard()
                }
                return
        }
        return
    }, [gameState])


    const renderScreen = () => {
        switch (gameState.state) {
            case GameState.NEW: 
                return <WaitingScreen players={players}/>
            case GameState.STARTING_QUIZ: 
                return <StartingQuizScreen />
            case GameState.STARTING_NEXT_QUESTION:
                return <StartingQuestionScreen transitionToNextState={transitionToNextState} />
            case GameState.SHOW_QUESTION: 
            case GameState.SHOW_ANSWERS:
            case GameState.SHOW_RESULT: 
                const labels = ['A', 'B', 'C', 'D']
                const correctAns = questions[question]['answer']
                labels[correctAns] += '✓'
                return <QuestionScreen 
                    question={questions[question]['question']}
                    answers={questions[question]['answers']}
                    answer={questions[question]['answer']}
                    answeredCount={answeredCount}
                    state={gameState.state}
                    labels={labels}
                    responses={responses}
                    transitionToNextState={transitionToNextState}
                />
                
            case GameState.SHOW_LEADERBOARD: 
                return <LeaderboardScreen leaderboard={leaderboard}/>
            case GameState.SHOW_FINAL_RESULTS: return <div>Final score</div>
        }
    }

    return (
        <div style={{ backgroundImage: `url(${background})` }} className='h-screen bg-cover bg-center'>
            <div className='bg-slate-900/50 text-white h-full flex flex-col'>
                <div className='h-full flex-1 flex flex-col container mx-auto max-w-6xl'>
                    <div className='text-center p-6'>
                        <div className="text-4xl tracking-wider font-ephesis text-yellow-500">
                            Kevin & Jewel
                        </div>
                        <div className='text-xs tracking-wider font-playfair'>28 July 2024</div>
                    </div>
                    <div className='text-center flex-1'>
                        {renderScreen()}
                        {playAudio}
                    </div>
                </div>
                <div className='flex flex-row-reverse'>
                    <button className='bg-sky-500 hover:bg-sky-600 active:bg-sky-700 px-4 py-2' onClick={transitionToNextState}>▶</button>
                </div>

            </div>

        </div>
    )
}

export default ScreenPage