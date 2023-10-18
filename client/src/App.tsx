import React, { useState } from "react";
import "./styles/global.css";
import { Input } from "./components";
import { LobbiPage } from "./pages";
import LoadingPage from "./pages/LoadingPage/LoadingPage";

const App: React.FC = () => {
   const [value, setValue] = useState<string>("");

   return (
      <div className="app">
           <LobbiPage/>
      </div>
  );
};

export default App;
