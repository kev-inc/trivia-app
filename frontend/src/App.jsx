import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PlayerPage from "./pages/PlayerPage";
import { useEffect, useState } from "react";
import { GameContext, GameState } from "./context/GameContext";
import DebugButtons from "./components/DebugButtons";
import ScreenPage from "./pages/ScreenPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PlayerPage />,
  }, {
    path: "/screen",
    element: <ScreenPage />,
  }
]);

function App() {
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
  return <RouterProvider router={router} />
}

export default App;
