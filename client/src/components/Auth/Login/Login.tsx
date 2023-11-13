import React, { useContext, useState } from "react";
import { Button, Input, Alert } from "../../UI";
import { IUserData, ISetPage } from "../../../interfaces";
import { MediatorContext, ServerContext } from "../../../App";
import { IAlert } from "../../UI/Alert/Alert";
import "../../../pages/MainPage/MainPage.css";

const Login: React.FC<ISetPage> = ({ setPage }) => {
  const [userData, setUserData] = useState<IUserData>({
    login: "",
    password: "",
  });

  const server = useContext(ServerContext);
  const mediator = useContext(MediatorContext);
  const { WARNING } = mediator.getTriggerTypes();

  const isValidInputs = async (): Promise<boolean> => {
    if (!userData.login || !userData.password) {
      mediator.get(WARNING, {
        message: "Заполните все поля",
        style: "warning",
      });
      return false;
    }
    const logRes = await server.login(userData.login, userData.password);
    if (!logRes) {
      return false;
    }
    return true;
  };

  const onChangeHandler = (value: string, data: string) => {
    setUserData({ ...userData, [data]: value });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await isValidInputs()) {
      setPage("Lobby");
      return;
    }
  };

  return (
    <form className="main_form" onSubmit={onSubmitHandler}>
      <div>
        <Input
          text="Логин"
          id="test_login_log_input"
          value={userData.login}
          onChange={(value) => {
            onChangeHandler(value, "login");
          }}
        />
        <Input
          text="Пароль"
          id="test_login_pass_input"
          type="hidePassword"
          value={userData.password}
          onChange={(value) => {
            onChangeHandler(value, "password");
          }}
        />
      </div>
      <div className="errors_div">
        <Alert />
      </div>
      <div className="main_footer">
        <Button
          appearance="primary"
          className="main_submit_button"
          id="test_login_submit_button"
        >
          Пойти на Бахмут
        </Button>
      </div>
    </form>
  );
};

export default Login;
