import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import { useEffect, useState } from "react";
import { GameContext, GameState } from "./context/GameContext";
import DebugButtons from "./components/DebugButtons";
import ScreenPage from "./pages/ScreenPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LobbyPage />,
  }, {
    path: "/screen",
    element: <ScreenPage />,
  }
]);

function App() {

  const [gameState, setGameState] = useState({
    name: '',
    state: GameState.NEW
  })
  useEffect(() => {
    function handleBeforeUnload(e) {
      e.preventDefault()
      return (e.returnValue='')
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
  useEffect(() => {
    console.log(gameState)
  }, [gameState])
  return <GameContext.Provider value={{ gameState, setGameState }}>
    <RouterProvider router={router} />
  </GameContext.Provider>
}

export default App;
