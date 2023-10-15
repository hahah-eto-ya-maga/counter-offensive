import React from "react";
import "./styles/global.css";
import Button from "./components/UI/Button/Button";

const App: React.FC = () => {
   return <div className="app">
      <div>
         <Button appearance="menu">Для меню</Button>
         <Button appearance="primary">Обычная</Button>
         <Button appearance="primary-disable">Отключена</Button>
      </div>
   </div>;
};

export default App;
