import { FC } from "react";
import { Button, Login } from "../../components";
import "../LoginPage/LoginPage.css";
import { Link } from "react-router-dom";

const LoginPage: FC = () => {
  return (
    <div className="login_wrapper">
      <div className="login_header">
        <div>
          <Button appearance="primary-disable" id="test_login_pageName_button">
            Уже служил
          </Button>
        </div>
        <div>
          <Link to="/registration">
            <Button appearance="primary" id="test_login_goToReg_button">
              Получить повестку
            </Button>
          </Link>
        </div>
      </div>
      <div className="login_content">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
