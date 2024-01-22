import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import { useState } from "react";
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
  return <GameContext.Provider value={{ gameState, setGameState }}>
    <RouterProvider router={router} />
    <DebugButtons />
  </GameContext.Provider>
}

export default App;
