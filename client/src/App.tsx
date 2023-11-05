import React from "react";
import "./styles/global.css";
import { LoadingPage,TankLobbyPage } from "./pages";

const App: React.FC = () => {
   return (
      <div className="app">
        <TankLobbyPage></TankLobbyPage>
      </div>
   );
};

export default App;
