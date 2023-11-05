import React from "react";
import { TankGamePage, PageHandler } from "./pages";
import "./styles/global.css";

const App: React.FC = () => {
   return (
      <div className="app">
         <TankGamePage/>
      </div>
   );
};

export default App;
