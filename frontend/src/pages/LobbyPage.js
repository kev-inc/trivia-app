import { useContext, useEffect, useState } from "react";
import { GameContext, GameState } from "../context/GameContext";
import { questions } from "../data/questions"
import { socket } from "../socket/socket";

const LobbyPage = () => {
  const { gameState, setGameState } = useContext(GameContext)
  const [questionNo, setQuestionNo] = useState(0)

  useEffect(() => {
    socket.on('connect', () => console.log('connecting to server'))
    socket.on('message', value => console.log(value))
    socket.on('joinedGame', ({username}) => {
      setGameState({state: GameState.WAITING, name: username})
      socket.on('gameStarting', () => {
        setGameState({state: GameState.STARTING_QUIZ, name: username})
      })
      socket.on('startingNextQuestion', () => {
        setGameState({state: GameState.STARTING_NEXT_QUESTION, name: username})
      })
      socket.on('showQuestion', ({question}) => {
        setGameState({state: GameState.SHOW_QUESTION, name: username})
        setQuestionNo(question)
      })
      socket.on('showAnswers', () => {
        setGameState({state: GameState.SHOW_ANSWERS, name: username})
      })
      socket.on('userAnswered', () => {
        setGameState({state: GameState.ANSWERED, name: username})
      })
      socket.on('showResult', () => {
        setGameState({state: GameState.SHOW_RESULT, name: username})
      })
      socket.on('showLeaderboard', () => {
        setGameState({state: GameState.SHOW_LEADERBOARD, name: username})
      })
      socket.on('showFinalResults', () => {
        setGameState({state: GameState.SHOW_FINAL_RESULTS, name: username})
      })
    })
    
  }, [])
  const joinGame = (e) => {
    e.preventDefault();
    const username = e.target.name.value
    socket.emit('joinGame', {username})
  };

  const welcomeComponent = (
    <form onSubmit={joinGame} className='my-8'>
      <input
        name="name"
        type="text"
        className="mt-8 border mb-4 text-center px-4 py-2"
        placeholder="What's your name?"
      />
      <br />
      <button className="bg-sky-500 text-gray-100 border-gray-100 font-semibold px-2 py-1 text-xl border-4 active:bg-sky-700">
        Join!
      </button>
    </form>
  )

  const waitingComponent = (
    <div className='my-8'>
      <div>You&apos;re in, <span className='font-bold'>{gameState.name}</span>!</div>
      <div className='text-xs'>Waiting for others to join...</div>
    </div>
  )

  const startingComponent = (
    <div className='my-8'>
      Game is starting
    </div>
  )

  const questionComponent = (
    <div>{questions[questionNo]['question']}</div>
  )

  const answersComponent = (
    <div>
      <div className=' w-full grid grid-cols-1 text-white gap-4 text-3xl p-8 font-semibold text-left'>
        <button className='bg-red-500 p-4 animate__animated animate__bounceIn' onClick={() => submitAnswer(0)}>
            <span className='mr-2'>A.</span>
            {questions[questionNo]['answers'][0]}
        </button>
        <button className='bg-blue-500 p-4 animate__animated animate__bounceIn' onClick={() => submitAnswer(1)}>
            <span className='mr-2'>B.</span>
            {questions[questionNo]['answers'][1]}
        </button>
        <button className='bg-green-500 p-4 animate__animated animate__bounceIn' onClick={() => submitAnswer(2)}>
            <span className='mr-2'>C.</span>
            {questions[questionNo]['answers'][2]}
        </button>
        <button className='bg-yellow-500 p-4 animate__animated animate__bounceIn' onClick={() => submitAnswer(3)}>
            <span className='mr-2'>D.</span>
            {questions[questionNo]['answers'][3]}
        </button>
    </div>
    </div>
  )

  const submitAnswer = (answer) => {
    const correct = answer === questions[questionNo]['answer']
    socket.emit('userAnsweredQuestion', {questionNo, answer, correct})
  }

  const renderComponent = () => {
    switch (gameState.state) {
      case GameState.NEW: return welcomeComponent;
      case GameState.WAITING: return waitingComponent;
      case GameState.STARTING_QUIZ: return startingComponent;
      case GameState.SHOW_QUESTION: return questionComponent;
      case GameState.SHOW_ANSWERS: return answersComponent;
      case GameState.ANSWERED: return <div>answered!</div>

      default: return <span>{gameState.name} {gameState.state}</span>
    }
  }
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-300 flex-1"></div>
      <div className="border shadow p-4 text-center w-full bg-amber-50">
        <div className="border-4 p-4 bg-amber-50">
          <div className="text-xs tracking-wide">Kevin & Jewel</div>
          <div className="text-3xl font-light">Wedding Trivia</div>
          <div className="text-xs tracking-wide">28 July 2024</div>
          {renderComponent()}
        </div>
      </div>
      <div className="bg-gray-300 flex-1"></div>
    </div>
  );
};

export default LobbyPage;
