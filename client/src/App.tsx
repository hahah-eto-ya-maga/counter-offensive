import React from "react";
import "./styles/global.css";
import { LoadingPage, GamePage } from "./pages";

const App: React.FC = () => {
   return (
      <div className="app">
         <GamePage/>
      </div>
   );
};

export default App;
