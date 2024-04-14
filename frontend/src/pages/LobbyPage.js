import { useContext, useEffect, useState } from "react";
import { GameContext, GameState } from "../context/GameContext";
import { questions } from "../data/questions"
import { socket } from "../socket/socket";
import background from '../images/bg-screen1.JPG'
import AnswerCard from "../components/AnswerCard";

const LobbyPage = () => {
  const { gameState, setGameState } = useContext(GameContext)
  const [questionNo, setQuestionNo] = useState(0)

  useEffect(() => {
    socket.on('connect', () => console.log('connecting to server'))
    socket.on('message', value => console.log(value))
    socket.on('joinedGame', ({ username }) => {
      setGameState({ state: GameState.WAITING, name: username })

      socket.on('gameStarting', () => {
        setGameState({ state: GameState.STARTING_QUIZ, name: username })
      })
      socket.on('startingNextQuestion', () => {
        setGameState({ state: GameState.STARTING_NEXT_QUESTION, name: username })
      })
      socket.on('showQuestion', ({ question }) => {
        setGameState({ state: GameState.SHOW_QUESTION, name: username })
        setQuestionNo(question)
      })
      socket.on('showAnswers', () => {
        setGameState({ state: GameState.SHOW_ANSWERS, name: username })
      })
      socket.on('userAnswered', () => {
        setGameState({ state: GameState.ANSWERED, name: username })
      })
      socket.on('showResult', () => {
        setGameState({ state: GameState.SHOW_RESULT, name: username })
      })
      socket.on('showLeaderboard', ({leaderboard: lb}) => {
        const myPosition = lb['full'].findIndex(l => l.player_id == socket.id)
        console.log(lb, socket.id, myPosition)
        if (myPosition => 0) {
          setGameState({ state: GameState.SHOW_LEADERBOARD, name: username, position: myPosition, full: lb['full'] })
        }
      })
      socket.on('showFinalResults', () => {
        setGameState({ state: GameState.SHOW_FINAL_RESULTS, name: username })
      })
    })

  }, [])
  const joinGame = (e) => {
    e.preventDefault();
    const username = e.target.name.value
    if(username == '') {
      alert('Please enter your name!')
    }
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
      <button className=" px-4 py-2 text-xl font-playfair underline">
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

  const questionComponent = (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto'>{questions[questionNo]['question']}</div>
    </div>
  )

  const answersComponent = (
    <div>
      {questionComponent}
      <div className=' w-full grid grid-cols-1 text-white gap-4 text-3xl p-8 font-semibold'>
        <AnswerCard onclick={() => submitAnswer(0)} color='red' animated centered>
            <span className='mr-2'>A.</span>
            {questions[questionNo]['answers'][0]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(1)} color='blue' animated centered>
            <span className='mr-2'>B.</span>
            {questions[questionNo]['answers'][1]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(2)} color='green' animated centered>
            <span className='mr-2'>C.</span>
            {questions[questionNo]['answers'][2]}
        </AnswerCard>
        <AnswerCard onclick={() => submitAnswer(3)} color='yellow' animated centered>
            <span className='mr-2'>D.</span>
            {questions[questionNo]['answers'][3]}
        </AnswerCard>
      </div>
    </div>
  )

  const answerSubmittedComponent = (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto font-bold'>You&apos;ve submitted your answer! All the best!</div>
    </div>
  )

  const showCorrectAnswerComponent = (
    <div className='my-8 '>
      <div className='w-5/6 mx-auto font-playfair text-xl font-bold'>The answer is...</div>
      <div className='text-3xl p-8 font-semibold'>
        {
          questions[questionNo]['answer'] == 0 && (
            <AnswerCard color='red' animated centered>
                <span className='mr-2'>A.</span>
                {questions[questionNo]['answers'][0]}
            </AnswerCard>
          )
        }
        {
          questions[questionNo]['answer'] == 1 && (
            <AnswerCard color='blue' animated centered>
                <span className='mr-2'>B.</span>
                {questions[questionNo]['answers'][1]}
            </AnswerCard>
          )
        }
        {
          questions[questionNo]['answer'] == 2 && (
            <AnswerCard color='green' animated centered>
                <span className='mr-2'>C.</span>
                {questions[questionNo]['answers'][2]}
            </AnswerCard>
          )
        }
        {
          questions[questionNo]['answer'] == 3 && (
            <AnswerCard color='yellow' animated centered>
                <span className='mr-2'>D.</span>
                {questions[questionNo]['answers'][3]}
            </AnswerCard>
          )
        }
      </div>
    </div>
  )

  const showCurrentPositionComponent = gameState.full && (
    <div className='my-8 font-playfair text-xl'>
      <div className='w-5/6 mx-auto font-bold'>You are currently {gameState.position + 1}!</div>

      <div className='flex flex-col justify-center items-center h-full mt-3'>
        <div className=' w-1/2 h-full flex flex-col gap-y-4'>
          { (gameState.position - 1) >= 0 &&
            <div className='h-full opacity-20 flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4'>
              <span className='text-3xl font-playfair'>#{gameState.position}</span>
              <span className='text-3xl font-playfair'>{gameState.full[gameState.position-1].name}</span>
              <span className='text-4xl font-playfair'>{gameState.full[gameState.position-1].score}</span>
            </div>
          }
          {
            <div className='h-full flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4'>
              <span className='text-3xl font-playfair'>#{gameState.position+1}</span>
              <span className='text-3xl font-playfair'>{gameState.full[gameState.position].name}</span>
              <span className='text-4xl font-playfair'>{gameState.full[gameState.position].score}</span>
            </div>
          }
          { (gameState.position + 1) < gameState.full.length &&
            <div className='h-full opacity-20 flex mb-3 justify-between items-center px-8 py-2 border-grey bg-white text-black rounded border-4'>
              <span className='text-3xl font-playfair'>#{gameState.position+2}</span>
              <span className='text-3xl font-playfair'>{gameState.full[gameState.position+1].name}</span>
              <span className='text-4xl font-playfair'>{gameState.full[gameState.position+1].score}</span>
            </div>
          }
        </div>
      </div>
    </div>
  )

  const submitAnswer = (answer) => {
    const correct = answer === questions[questionNo]['answer']
    socket.emit('userAnsweredQuestion', { questionNo, answer, correct })
  }

  const renderComponent = () => {
    switch (gameState.state) {
      case GameState.NEW: return welcomeComponent;
      case GameState.WAITING: return waitingComponent;
      case GameState.STARTING_QUIZ: return startingComponent;
      case GameState.STARTING_NEXT_QUESTION: return nextQuestionComponent;
      case GameState.SHOW_QUESTION: return questionComponent;
      case GameState.SHOW_ANSWERS: return answersComponent;
      case GameState.ANSWERED: return answerSubmittedComponent;
      case GameState.SHOW_RESULT: return showCorrectAnswerComponent;
      case GameState.SHOW_LEADERBOARD: return showCurrentPositionComponent;

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

export default LobbyPage;
