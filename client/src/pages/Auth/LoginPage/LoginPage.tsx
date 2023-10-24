import React from "react";
import { Button, Login } from "../../../components";
import "../Auth.css";

const LoginPage: React.FC = () => {
  return (
    <div className="auth_wrapper">
      <div className="auth_header">
        <Button appearance="primary-disable">Авторизация</Button>
        <Button appearance="primary">Вернуться в меню</Button>
      </div>
      <div className="auth_content">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
