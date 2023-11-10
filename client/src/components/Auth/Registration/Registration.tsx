import React, { useContext, useState } from "react";
import { ServerContext } from "../../../App";
import { Button, Input, Alert } from "../../UI";
import { ISetPage, IUserData } from "../../../interfaces";
import { IAlertProps } from "../../UI/Alert/Alert";

import "../../../pages/RegistrationPage/RegistrationPage.css";

const Registration: React.FC<ISetPage> = ({ setPage }) => {
  const [userData, setUserData] = useState<IUserData>({
    login: "",
    password: "",
    nickName: "",
  });
  const [alertInfo, setAlertInfo] = useState<IAlertProps>(null!);

  const server = useContext(ServerContext);

  const onChangeHandler = (value: string, data: string) => {
    setUserData({ ...userData, [data]: value });
  };

  const isLoginValid = () => {
    if (!userData.login || !userData.password || !userData.nickName) {
      setAlertInfo({
        alertMessage: "Заполните все поля",
        alertStyle: "warning",
      });
      return false;
    }
    const loginLength = userData.login.length;
    if (loginLength <= 6 || loginLength > 15) {
      setAlertInfo({
        alertMessage: "Логин должен содержать от 6 до 15 символов",
        alertStyle: "warning",
      });
    }
    const isValigLogin = /^[a-zA-Zа-яА-Я0-9Ёё]*$/;
    if (!isValigLogin.test(userData.login)) {
      setAlertInfo({
        alertMessage:
          "Логин может содержать символы кириллицы, латиницы и цифры",
        alertStyle: "warning",
      });
    }
  };

  const isValidInputs = async (): Promise<boolean> => {
    if (!userData.login || !userData.password || !userData.nickName) {
      setAlertInfo({
        alertMessage: "Заполните все поля",
        alertStyle: "warning",
      });
      return false;
    }
    const loginLength = userData.login.length;
    if (loginLength < 6 || loginLength > 15) {
      setAlertInfo({
        alertMessage: "Логин должен содержать от 6 до 15 символов",
        alertStyle: "warning",
      });
      return false;
    }
    const isValigLogin = /^[a-zA-Zа-яА-Я0-9Ёё]*$/;
    if (!isValigLogin.test(userData.login)) {
      setAlertInfo({
        alertMessage:
          "Логин может содержать символы кириллицы, латиницы и цифры",
        alertStyle: "warning",
      });
      return false;
    }
    const passLength = userData.password.length;
    if (passLength < 8 || passLength > 200) {
      setAlertInfo({
        alertMessage: "В пароле должно быть от 8 до 200 символов",
        alertStyle: "warning",
      });
      return false;
    }
    const logRes = await server.registration(
      userData.login,
      userData.nickName,
      userData.password
    );
    if (!logRes) {
      setAlertInfo({
        alertMessage: "Логин занят",
        alertStyle: "error",
      });
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //условие валидации
    if (await isValidInputs()) {
      const res = await server.registration(
        userData.login,
        userData.nickName ?? "",
        userData.password
      );
      if (res) {
        setPage("Lobby");
      }
      return;
    }
    //обработка ошибок
  };

  return (
    <form className="reg_form" onSubmit={onSubmitHandler}>
      <div>
        <Input
          text="Логин"
          id="test_reg_log_input"
          value={userData.login}
          onChange={(value) => {
            onChangeHandler(value, "login");
          }}
        />
        <Input
          text="Никнейм"
          id="test_reg_nick_input"
          value={userData.nickName ?? ""}
          onChange={(value) => {
            onChangeHandler(value, "nickName");
          }}
        />
        <Input
          text="Пароль"
          id="test_reg_pass_input"
          type="hidePassword"
          value={userData.password}
          onChange={(value) => {
            onChangeHandler(value, "password");
          }}
        />
      </div>
      <div className="errors_div">
        {alertInfo && <Alert {...alertInfo} />}
        <div className="warning">
          <span>Логин может содержать символы кириллицы, латиницы и цифры</span>
        </div>
      </div>
      <div className="reg_footer">
        <Button
          appearance="primary"
          className="reg_submit_button"
          id="test_reg_submit_button"
        >
          Попасть в списки военных
        </Button>
      </div>
    </form>
  );
};

export default Registration;
