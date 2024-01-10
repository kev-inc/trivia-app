import { useContext, useEffect } from "react";
import { GameContext, GameState } from "../context/GameContext";
import { socket } from "../socket/socket";

const LobbyPage = () => {
  const { gameState, setGameState } = useContext(GameContext)

  useEffect(() => {
    socket.on('connect', () => console.log('connecting to server'))
  }, [])
  const joinGame = (e) => {
    e.preventDefault();
    setGameState({
      state: GameState.WAITING,
      name: e.target.name.value
    })
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
      Game is starting!
    </div>
  )

  const renderComponent = () => {
    switch (gameState.state) {
      case GameState.NEW: return welcomeComponent;
      case GameState.WAITING: return waitingComponent;
      case GameState.STARTING: return startingComponent;
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
