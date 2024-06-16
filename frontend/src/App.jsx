import { createBrowserRouter, RouterProvider } from "react-router-dom";
import PlayerPage from "./pages/PlayerPage";
import { createContext, useEffect, useState } from "react";
import { GameContext, GameState } from "./context/GameContext";
import DebugButtons from "./components/DebugButtons";
import ScreenPage from "./pages/ScreenPage";
import ResetPage from "./pages/ResetPage";
import Loading from "./components/Loading";
import { LoadingContext } from "./context/LoadingContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PlayerPage />,
  }, {
    path: "/screen",
    element: <ScreenPage />,
  }, {
    path: "/resetgs",
    element: <ResetPage />,
  }, {
    path: "/bgm",
    element: <a className="underline" href="https://www.youtube.com/watch?v=Uj93hicGDNc&ab_channel=StreamCafe">Link to youtube</a>
  }
]);

function App() {

  const [displaySpinner, setDisplaySpinner] = useState(true)

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
  return <LoadingContext.Provider value={{displaySpinner, setDisplaySpinner}}>
    {displaySpinner && <Loading />}
    <RouterProvider router={router} />
  </LoadingContext.Provider>
}

export default App;
