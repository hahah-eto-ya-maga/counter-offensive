import React from "react";
import "./styles/global.css";
import { LoadingPage } from "./pages";
import { Login } from './components';

const App: React.FC = () => {
   return (
      <div className="app">
         <Login />
      </div>
   );
};

export default App;
