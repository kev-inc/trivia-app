import { useContext, useEffect, useState } from "react";
import { GameContext, GameState } from "../context/GameContext";
import { socket } from "../socket/socket";
import background from '../images/bg-screen1.JPG'
import AnswerCard from "../components/AnswerCard";
import { questionList } from "../data/questions";
import { LoadingContext } from "../context/LoadingContext";
import SOCKET_MESSAGES from "../data/constants";

const nth = (n) => { return ["st", "nd", "rd"][((n + 90) % 100 - 10) % 10 - 1] || "th" }

const PlayerPage = () => {

  const { displaySpinner, setDisplaySpinner } = useContext(LoadingContext)

  const [gameState, setGameState] = useState({
    state: GameState.NEW,
    name: null,
    questionNumber: 0,
  })

  const [answered, setAnswered] = useState(false)
  const [position, setPosition] = useState(0)
  // const { gameState, setGameState } = useContext(GameContext)
  // const [questionNo, setQuestionNo] = useState(0)

  useEffect(() => {
    socket.on(SOCKET_MESSAGES.S2C.CONNECT, () => setDisplaySpinner(false))
    socket.on(SOCKET_MESSAGES.S2C.CONNECTION_ERROR, () => console.error('connection failed'))
    // socket.on('message', value => console.log(value))

    socket.on(SOCKET_MESSAGES.S2C.JOIN_GAME_ERROR, ({ msg }) => {
      setDisplaySpinner(false)
      alert(msg)
    })

    socket.on(SOCKET_MESSAGES.S2C.JOINED_GAME, ({ username }) => {
      setDisplaySpinner(false)

      setGameState((prevState) => ({ ...prevState, state: GameState.WAITING, name: username }))

      socket.on(SOCKET_MESSAGES.S2C.UPDATE_STATE, ({ gamestate }) => {
        if (gamestate.state == GameState.STARTING_NEXT_QUESTION) {
          setAnswered(false)
          setDisplaySpinner(false)
        }

        setGameState({
          state: gamestate.state,
          name: username,
          questionNumber: gamestate.questionNumber,
          leaderboard: gamestate.leaderboard,
        })
        if (gamestate.state == GameState.SHOW_LEADERBOARD) {
          const myPosition = gamestate.leaderboard.full.findIndex(l => l.player_name == username)
          console.log(gameState.leaderboard)
          if (myPosition => 0) {
            setPosition(myPosition)
          }
        }
      })

      socket.on(SOCKET_MESSAGES.S2C.USER_ANSWERED, () => {
        setGameState(prevState => ({ ...prevState, state: GameState.ANSWERED }))
      })
    })

  }, [])
  const joinGame = (e) => {
    e.preventDefault();
    const username = e.target.name.value
    if (username == '') {
      alert('Please enter your name!')
      return
    }
    if (username.length > 10) {
      alert('Please enter a shorter name')
      return
    }
    setDisplaySpinner(true)
    socket.emit(SOCKET_MESSAGES.C2S.JOIN_GAME, { username })
  };

  const welcomeComponent = (
    <form onSubmit={joinGame} className='my-8'>
      <input
        name="name"
        type="text"
        className="mt-8 border mb-4 text-center px-4 py-2 rounded text-black"
        placeholder="What's your name?"
      />
      <br />
      <button className=" px-4 py-2 text-xl font-playfair underline active:opacity-50">
        Join!
      </button>
    </form>
  )

  const nameComponent = (
    <div className='my-8 font-playfair'>
      <div className='text-xl'>Welcome, <span className='font-bold'>{gameState.name}</span>!</div>
    </div>
  )

  const waitingComponent = (
    <div className='my-8 font-playfair'>
      <div className='text-xl'>You&apos;re in, <span className='font-bold'>{gameState.name}</span>!</div>
      <div className='text-base mx-auto mt-8'>Waiting for others to join...</div>
    </div>
  )

  const startingComponent = (
    <div className='my-8 font-playfair'>
      <div className='text-xl font-bold'>Game is starting!</div>
      <div className='text-base w-1/2 mx-auto mt-8'>Questions and answers will be displayed both on screen and on your device</div>
    </div>
  )

  const nextQuestionComponent = (
    <div className='my-8 font-playfair'>
      <div className='text-xl font-bold'>Question is coming up!</div>
      {/* <div className='text-base w-1/2 mx-auto mt-8'>Questions and answers will be displayed both on screen and on your device</div> */}
    </div>
  )

  const questionComponent = gameState.questionNumber < questionList.length && (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto select-none'>{questionList[gameState.questionNumber]['question']}</div>
    </div>
  )

  const answersComponent = gameState.questionNumber < questionList.length && (
    <div>
      {questionComponent}
      <div className=' w-full grid grid-cols-1 text-white gap-4 text-3xl p-8 font-semibold'>
        <AnswerCard onclick={() => submitAnswer(0)} color='red' animated centered>
          <span className='mr-2'>A.</span>
          {questionList[gameState.questionNumber]['answers'][0]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(1)} color='blue' animated centered>
          <span className='mr-2'>B.</span>
          {questionList[gameState.questionNumber]['answers'][1]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(2)} color='green' animated centered>
          <span className='mr-2'>C.</span>
          {questionList[gameState.questionNumber]['answers'][2]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(3)} color='yellow' animated centered>
          <span className='mr-2'>D.</span>
          {questionList[gameState.questionNumber]['answers'][3]}
        </AnswerCard>
      </div>
    </div>
  )

  const answerSubmittedComponent = (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto font-bold'>You&apos;ve submitted your answer! All the best!</div>
    </div>
  )

  const showCorrectAnswerComponent = gameState.questionNumber <questionList.length && (
    <div className='my-8 '>
      <div className='w-5/6 mx-auto font-playfair text-xl font-bold'>The answer is...</div>
      <div className='text-3xl p-8 font-semibold'>
        {
          questionList[gameState.questionNumber]['answer'] == 0 && (
            <AnswerCard color='red' animated centered>
              <span className='mr-2'>A.</span>
              {questionList[gameState.questionNumber]['answers'][0]}
            </AnswerCard>
          )
        }
        {
          questionList[gameState.questionNumber]['answer'] == 1 && (
            <AnswerCard color='blue' animated centered>
              <span className='mr-2'>B.</span>
              {questionList[gameState.questionNumber]['answers'][1]}
            </AnswerCard>
          )
        }
        {
          questionList[gameState.questionNumber]['answer'] == 2 && (
            <AnswerCard color='green' animated centered>
              <span className='mr-2'>C.</span>
              {questionList[gameState.questionNumber]['answers'][2]}
            </AnswerCard>
          )
        }
        {
          questionList[gameState.questionNumber]['answer'] == 3 && (
            <AnswerCard color='yellow' animated centered>
              <span className='mr-2'>D.</span>
              {questionList[gameState.questionNumber]['answers'][3]}
            </AnswerCard>
          )
        }
      </div>
    </div>
  )

  const showCurrentPositionComponent = ('leaderboard' in gameState && 'full' in gameState.leaderboard) && (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto font-bold'>You are currently {position + 1}{nth(position + 1)}!</div>

      <div className='flex flex-col justify-center items-center h-full mt-3'>
        <div className='w-full px-4 h-full flex flex-col gap-y-4'>
          {(position - 1) >= 0 &&
            <div className='h-full opacity-20 flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4'>
              <span className='text-3xl font-playfair'>#{position}</span>
              <span className='text-3xl font-playfair'>{gameState.leaderboard.full[position - 1]?.player_name}</span>
              <span className='text-4xl font-playfair'>{gameState.leaderboard.full[position - 1]?.score}</span>
            </div>
          }
          {
            <div className='h-full flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4'>
              <span className='text-3xl font-playfair'>#{position + 1}</span>
              <span className='text-3xl font-playfair'>{gameState.leaderboard.full[position]?.player_name}</span>
              <span className='text-4xl font-playfair'>{gameState.leaderboard.full[position]?.score}</span>
            </div>
          }
          {(position + 1) < gameState.leaderboard.full.length &&
            <div className='h-full opacity-20 flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4'>
              <span className='text-3xl font-playfair'>#{position + 2}</span>
              <span className='text-3xl font-playfair'>{gameState.leaderboard.full[position + 1]?.player_name}</span>
              <span className='text-4xl font-playfair'>{gameState.leaderboard.full[position + 1]?.score}</span>
            </div>
          }
        </div>
      </div>
    </div>
  )

  const finalLeaderboardComponent = (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto font-bold'>Eyes up on the screen to see your final score!</div>
    </div>
  )

  const submitAnswer = (answer) => {
    const correct = answer === questionList[gameState.questionNumber]['answer']
    socket.emit('userAnsweredQuestion', { name: gameState.name, questionNo: gameState.questionNumber, answer, correct })
    setDisplaySpinner(true)
  }

  const renderComponent = () => {
    switch (gameState.state) {
      case GameState.NEW: return welcomeComponent
      case GameState.WAITING: return waitingComponent;
      case GameState.STARTING_QUIZ: return startingComponent;
      case GameState.STARTING_NEXT_QUESTION: return nextQuestionComponent;
      case GameState.SHOW_QUESTION: return questionComponent;
      case GameState.SHOW_QUESTION_OPTIONS: return answersComponent;
      case GameState.ANSWERED: 
        setDisplaySpinner(false)
        return answerSubmittedComponent;
      case GameState.SHOW_CORRECT_ANSWER: return showCorrectAnswerComponent;
      case GameState.SHOW_LEADERBOARD: return showCurrentPositionComponent;
      case GameState.SHOW_FINAL_RESULTS_SHOW_0: 
      case GameState.SHOW_FINAL_RESULTS_SHOW_1: 
      case GameState.SHOW_FINAL_RESULTS_SHOW_2: 
      case GameState.SHOW_FINAL_RESULTS_SHOW_3: 
        return finalLeaderboardComponent
      default: return <span>{gameState.name} {gameState.state}</span>
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
            {renderComponent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
