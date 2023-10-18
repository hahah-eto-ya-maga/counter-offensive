import React, { useState } from "react";
import "./styles/global.css";
import { LobbiPage } from "./pages";

const App: React.FC = () => {
   const [value, setValue] = useState<string>("");

   return (
      <div className="app">
           <LobbiPage/>
      </div>
  );
};

export default App;
