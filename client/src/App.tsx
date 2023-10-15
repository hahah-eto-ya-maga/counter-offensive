import React from "react";
import "./styles/global.css";
import LoginPage from "./pages/Auth/LoginPage/LoginPage";

const App: React.FC = () => {
  return (
    <div className="app">
      <LoginPage />
    </div>
  );
};

export default App;
