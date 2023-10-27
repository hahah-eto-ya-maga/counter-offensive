import React, { useState } from "react";
import { Button, Input } from "../../UI";
import { IUserData } from "../../../interfaces";
import "../../../pages/MainPage/MainPage.css";
import { ISetPage } from '../../../interfaces';

const Login: React.FC<ISetPage> = ({ setPage }) => {
  const [userData, setUserData] = useState<IUserData>({
    login: "",
    password: "",
  });

  const onChangeHandler = (value: string, data: string) => {
    setUserData({ ...userData, [data]: value });
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {};

  return (
    <form className="main_form" onSubmit={onSubmitHandler}>
      <div>
        <Input
          text="Логин"
          value={userData.login}
          onChange={(value) => {
            onChangeHandler(value, "login");
          }}
        />
        <Input
          text="Пароль"
          type="hidePassword"
          value={userData.password}
          onChange={(value) => {
            onChangeHandler(value, "password");
          }}
        />
      </div>
      <div className="errors_div">
        <div className="warning">
          <span>Заполните все поля</span>
        </div>
        <div className="error">
          <span>Неверный логин или пароль</span>
        </div>
      </div>
      <div className="main_footer">
        <Button
          appearance="primary"
          className="main_submit_button"
          onClick={() => {
            setPage("Lobby");
          }}
        >
          Пойти на Бахмут
        </Button>
      </div>
    </form>
  );
};

export default Login;
