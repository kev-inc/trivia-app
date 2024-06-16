import { useContext, useEffect, useState } from "react";
import { GameContext, GameState } from "../context/GameContext";
import { socket } from "../socket/socket";
import background from '../images/bg-screen1.JPG'
import AnswerCard from "../components/AnswerCard";
import { questions } from "../data/questions";
import { LoadingContext } from "../context/LoadingContext";

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
    socket.on('connect', () => setDisplaySpinner(false))
    socket.on('connect_error', () => console.error('connection failed'))
    // socket.on('message', value => console.log(value))

    socket.on('joinGameError', ({ msg }) => {
      setDisplaySpinner(false)
      alert(msg)
    })

    socket.on('joinedGame', ({ username }) => {
      setDisplaySpinner(false)

      setGameState((prevState) => ({ ...prevState, state: GameState.WAITING, name: username }))

      socket.on('updateState', ({ gamestate }) => {
        if (gamestate.state == GameState.STARTING_NEXT_QUESTION) {
          setAnswered(false)
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

      socket.on('userAnswered', () => {
        setGameState(prevState => ({ ...prevState, state: GameState.ANSWERED }))
      })

      // socket.on('gameStarting', () => {
      //   setGameState({ state: GameState.STARTING_QUIZ, name: username })
      // })
      // socket.on('startingNextQuestion', () => {
      //   setGameState({ state: GameState.STARTING_NEXT_QUESTION, name: username })
      // })
      // socket.on('showQuestion', ({ question }) => {
      //   setGameState({ state: GameState.SHOW_QUESTION, name: username })
      //   setQuestionNo(question)
      // })
      // socket.on('showAnswers', () => {
      //   setGameState({ state: GameState.SHOW_ANSWERS, name: username })
      // })

      // socket.on('showResult', () => {
      //   setGameState({ state: GameState.SHOW_RESULT, name: username })
      // })
      // socket.on('showLeaderboard', ({leaderboard: lb}) => {
      //   const myPosition = lb['full'].findIndex(l => l.player_id == socket.id)
      //   console.log(lb, socket.id, myPosition)
      //   if (myPosition => 0) {
      //     setGameState({ state: GameState.SHOW_LEADERBOARD, name: username, position: myPosition, full: lb['full'] })
      //   }
      // })
      // socket.on('showFinalResults', () => {
      //   setGameState({ state: GameState.SHOW_FINAL_RESULTS, name: username })
      // })
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
    socket.emit('joinGame', { username })
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

  const questionComponent = gameState.questionNumber < questions.length && (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto select-none'>{questions[gameState.questionNumber]['question']}</div>
    </div>
  )

  const answersComponent = gameState.questionNumber < questions.length && (
    <div>
      {questionComponent}
      <div className=' w-full grid grid-cols-1 text-white gap-4 text-3xl p-8 font-semibold'>
        <AnswerCard onclick={() => submitAnswer(0)} color='red' animated centered>
          <span className='mr-2'>A.</span>
          {questions[gameState.questionNumber]['answers'][0]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(1)} color='blue' animated centered>
          <span className='mr-2'>B.</span>
          {questions[gameState.questionNumber]['answers'][1]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(2)} color='green' animated centered>
          <span className='mr-2'>C.</span>
          {questions[gameState.questionNumber]['answers'][2]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(3)} color='yellow' animated centered>
          <span className='mr-2'>D.</span>
          {questions[gameState.questionNumber]['answers'][3]}
        </AnswerCard>
      </div>
    </div>
  )

  const answerSubmittedComponent = (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto font-bold'>You&apos;ve submitted your answer! All the best!</div>
    </div>
  )

  const showCorrectAnswerComponent = gameState.questionNumber < questions.length && (
    <div className='my-8 '>
      <div className='w-5/6 mx-auto font-playfair text-xl font-bold'>The answer is...</div>
      <div className='text-3xl p-8 font-semibold'>
        {
          questions[gameState.questionNumber]['answer'] == 0 && (
            <AnswerCard color='red' animated centered>
              <span className='mr-2'>A.</span>
              {questions[gameState.questionNumber]['answers'][0]}
            </AnswerCard>
          )
        }
        {
          questions[gameState.questionNumber]['answer'] == 1 && (
            <AnswerCard color='blue' animated centered>
              <span className='mr-2'>B.</span>
              {questions[gameState.questionNumber]['answers'][1]}
            </AnswerCard>
          )
        }
        {
          questions[gameState.questionNumber]['answer'] == 2 && (
            <AnswerCard color='green' animated centered>
              <span className='mr-2'>C.</span>
              {questions[gameState.questionNumber]['answers'][2]}
            </AnswerCard>
          )
        }
        {
          questions[gameState.questionNumber]['answer'] == 3 && (
            <AnswerCard color='yellow' animated centered>
              <span className='mr-2'>D.</span>
              {questions[gameState.questionNumber]['answers'][3]}
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
    const correct = answer === questions[gameState.questionNumber]['answer']
    socket.emit('userAnsweredQuestion', { name: gameState.name, questionNo: gameState.questionNumber, answer, correct })
  }

  const renderComponent = () => {
    switch (gameState.state) {
      case GameState.NEW: return welcomeComponent
      case GameState.WAITING: return waitingComponent;
      case GameState.STARTING_QUIZ: return startingComponent;
      case GameState.STARTING_NEXT_QUESTION: return nextQuestionComponent;
      case GameState.SHOW_QUESTION: return questionComponent;
      case GameState.SHOW_ANSWERS: return answersComponent;
      case GameState.ANSWERED: return answerSubmittedComponent;
      case GameState.SHOW_RESULT: return showCorrectAnswerComponent;
      case GameState.SHOW_LEADERBOARD: return showCurrentPositionComponent;
      case GameState.SHOW_FINAL_RESULTS: return finalLeaderboardComponent

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
