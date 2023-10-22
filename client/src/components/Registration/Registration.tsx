import React, { useState } from "react";
import { Button, Input } from "../UI";
import { IUserData } from "../../interfaces";
import "./Registration.css";

const Registration: React.FC = () => {
  const [userData, setUserData] = useState<IUserData>({
    login: "",
    password: "",
    passwordTwo: "",
  });

  const onChangeHandler = (value: string, data: string) => {
    setUserData({ ...userData, [data]: value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {};

  return (
    <form className="auth_form" onSubmit={onSubmitHandler}>
      <div className="row_div">
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
        <Input
          text="Повтор пароля"
          type="password"
          value={userData.passwordTwo ?? ""}
          onChange={(value) => {
            onChangeHandler(value, "passwordTwo");
          }}
        />
      </div>
      <div className="errors_div">
        <div className="warning">
          <span>Заполните все поля</span>
        </div>
        <div className="warning">
          <span>В логине должно быть от 5 до 15 символов</span>
        </div>
        <div className="warning">
          <span>В пароле должно быть от 7 до 200 символов</span>
        </div>
        <div className="error">
          <span>Логин занят</span>
        </div>
        <div className="warning">
          <span>Пароли не совпадают</span>
        </div>
      </div>
      <div className="auth_footer">
        <Button appearance="primary" className="auth_submit_button">
          Попасть в списки военных
        </Button>
      </div>
    </form>
  );
};

export default Registration;
