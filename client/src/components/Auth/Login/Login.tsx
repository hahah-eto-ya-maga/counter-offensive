import React, { useState } from "react";
import { Button, Input } from "../../UI";
import { IUserData } from "../../../interfaces";
import "./Login.css";

const Login: React.FC = () => {
  const [userData, setUserData] = useState<IUserData>({
    login: "",
    password: "",
  });

  const onChangeHandler = (value: string, data: string) => {
    setUserData({ ...userData, [data]: value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {};

  return (
    <form className="auth_form" onSubmit={onSubmitHandler}>
      <div className="row_div">
        <div className="column_div">
          <Input
            text="Логин"
            value={userData.login}
            onChange={(value) => {
              onChangeHandler(value, "login");
            }}
          />
          <Input
            text="Пароль"
            type="password"
            value={userData.password}
            onChange={(value) => {
              onChangeHandler(value, "password");
            }}
          />
        </div>
      </div>
      <div className="row_div">
        <div className="column_div">
          <div className="error_div">Неверный логин или пароль</div>
          <div className="warning_div">Заполните все поля</div>
        </div>
      </div>
      <div className="auth_footer">
        <Button appearance="primary" className="auth_submit_button">
          Пойти на Бахмут
        </Button>
      </div>
    </form>
  );
};

export default Login;
