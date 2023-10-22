import React from "react";
import { PageHandler } from "./pages";
import "./styles/global.css";
import { Registration } from "./components";

const App: React.FC = () => {
   return (
      <div className="app">
         <PageHandler />
      </div>
   );
};

export default App;