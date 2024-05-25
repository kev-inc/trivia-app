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
import FinalLeaderboardScreen from "../components/screen/FinalLeaderboardScreen";

const ScreenPage = () => {

    const [playQuestionTimesUp, {sound: soundQuestionTimesUp}] = useSound(questionTimesUpSfx)
    const [playLobby, {stop: stopLobby}] = useSound(lobbySfx)
    const [playQuestion1, {stop: stopQuestion1}] = useSound(question1Sfx)
    const [playQuestion2, {sound: soundQ2, stop: stopQ2}] = useSound(question2Sfx)
    const [playLeaderboard, {sound: soundLeaderboard}] = useSound(leaderboardSfx)

    const [gameState, setGameState] = useState({
        state: GameState.NEW,
        players: [],
        questionNumber: 0,
        responses: [],
        answeredCount: 0,
        leaderboard: []
    })

    useEffect(() => {
        socket.on('connect', () => console.log('connected to server'))
        socket.on('connect_error', () => console.error('connection failed'))
        socket.on('updateState', ({gamestate}) => {
            console.log(gamestate)
            if (gamestate.state != gameState.state) {
                console.log(gamestate.state)
                switch (gamestate.state) {
                    case GameState.STARTING_NEXT_QUESTION:
                        // if (!soundQ2.playing()) {
                            playQuestion2()
                            break
                        // }
                    case GameState.SHOW_RESULT:
                        // if (soundQ2.playing()) {
                            stopQ2()
                        // }
                        // if (!soundQuestionTimesUp.playing()) {
                            playQuestionTimesUp()
                            break
                        // }
                    case GameState.SHOW_LEADERBOARD:
                        // if (!soundLeaderboard.playing()) {
                            playLeaderboard()
                            break
                        // }
                }
            }
            setGameState({
                state: gamestate.state,
                players: gamestate.players,
                questionNumber: gamestate.questionNumber,
                responses: gamestate.currentQuestionResponses,
                answeredCount: gamestate.answeredCount,
                leaderboard: gamestate.leaderboard
            })
        })

        socket.on('updatePlayers', ({ players }) => {
            setGameState((prevState) => ({
                ...prevState, 
                players: players
            }))
        })
        socket.on('updateAnsweredCount', ({gamestate}) => {
            setGameState({
                state: gamestate.state,
                players: gamestate.players,
                questionNumber: gamestate.questionNumber,
                responses: gamestate.currentQuestionResponses,
                answeredCount: gamestate.answeredCount,
                leaderboard: gamestate.leaderboard
            })
        })
    }, [])

    const transitionToNextState = () => {
        socket.emit('requestNextState')
    }

    // const playAudio = useMemo(() => {
        
    //     return
    // }, [gameState])


    const renderScreen = () => {
        switch (gameState.state) {
            case GameState.NEW: 
                return <WaitingScreen players={gameState.players}/>
            case GameState.STARTING_QUIZ: 
                return <StartingQuizScreen />
            case GameState.STARTING_NEXT_QUESTION:
                return <StartingQuestionScreen transitionToNextState={transitionToNextState} />
            case GameState.SHOW_QUESTION: 
            case GameState.SHOW_ANSWERS:
            case GameState.SHOW_RESULT: 
                const labels = ['A', 'B', 'C', 'D']
                const correctAns = questions[gameState.questionNumber]['answer']
                labels[correctAns] += '✓'
                return <QuestionScreen 
                    question={questions[gameState.questionNumber]['question']}
                    answers={questions[gameState.questionNumber]['answers']}
                    answer={questions[gameState.questionNumber]['answer']}
                    answeredCount={gameState.answeredCount}
                    state={gameState.state}
                    labels={labels}
                    responses={gameState.responses}
                    transitionToNextState={transitionToNextState}
                />
                
            case GameState.SHOW_LEADERBOARD: 
                return <LeaderboardScreen leaderboard={gameState.leaderboard}/>
            case GameState.SHOW_FINAL_RESULTS: 
                return <FinalLeaderboardScreen leaderboard={gameState.leaderboard} transitionToNextState={transitionToNextState} />
        }
    }

    const transitionButtonClick = () => {
        if (gameState.state != GameState.SHOW_FINAL_RESULTS) {
            transitionToNextState()
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
                        {/* {playAudio} */}
                    </div>
                </div>
                <div className='flex flex-row-reverse'>
                    <button className='bg-sky-500 hover:bg-sky-600 active:bg-sky-700 px-4 py-2' onClick={transitionButtonClick}>▶</button>
                </div>

            </div>

        </div>
    )
}

export default ScreenPage
