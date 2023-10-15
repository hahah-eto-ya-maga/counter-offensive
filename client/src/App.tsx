import React, { useState } from "react";
import "./styles/global.css";
import { Input } from "./components";

const App: React.FC = () => {
   const [value, setValue] = useState<string>("");

   return (
      <div className="app">
         <div>
            <Input text="Введите пароль" value={value} onChange={setValue} />
         </div>
      </div>
   );
};

export default App;
