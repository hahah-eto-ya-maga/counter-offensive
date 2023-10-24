import React from "react";
import { PageHandler } from "./pages";
import "./styles/global.css";
import { GamePage } from "./pages";

const App: React.FC = () => {
   return (
      <div className="app">
         <GamePage/>
      </div>
   );
};

export default App;
