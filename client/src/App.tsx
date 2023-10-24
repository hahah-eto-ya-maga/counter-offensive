import React from "react";
import { GamePage, PageHandler } from "./pages";
import "./styles/global.css";

const App: React.FC = () => {
   return (
      <div className="app">
         <PageHandler />
      </div>
   );
};

export default App;
