import React from "react";
import "./styles/global.css";
import { LoadingPage } from "./pages";

const App: React.FC = () => {
   return (
      <div className="app">
         <LoadingPage />
      </div>
   );
};

export default App;
