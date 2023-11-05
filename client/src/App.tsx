import React from "react";
import "./styles/global.css";
import { LoadingPage,TankTwoLobbyPage } from "./pages";

const App: React.FC = () => {
   return (
      <div className="app">
        <TankTwoLobbyPage/>
      </div>
   );
};

export default App;
