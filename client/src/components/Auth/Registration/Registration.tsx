import React, { useContext, useState } from "react";
import { MediatorContext, ServerContext } from "../../../App";
import { Button, Input, Alert } from "../../UI";
import { ISetPage, IUserData } from "../../../interfaces";

import "../../../pages/RegistrationPage/RegistrationPage.css";

const Registration: React.FC<ISetPage> = ({ setPage }) => {
  const [userData, setUserData] = useState<IUserData>({
    login: "",
    password: "",
    nickName: "",
  });
  const server = useContext(ServerContext);
  const mediator = useContext(MediatorContext);
  const { WARNING } = mediator.getTriggerTypes();

  const onChangeHandler = (value: string, data: string) => {
    setUserData({ ...userData, [data]: value });
  };

  const isPasswordValid = async () => {
    const passLength = userData.password.length;
    if (passLength < 8 || passLength > 200) {
      mediator.get(WARNING, {
        message: "В пароле должно быть от 8 до 200 символов",
        style: "warning",
      });
      return false;
    }
    return true;
  };

  const isLoginValid = () => {
    const loginLength = userData.login.length;
    if (loginLength < 6 || loginLength > 15) {
      mediator.get(WARNING, {
        message: "Логин должен содержать от 6 до 15 символов",
        style: "warning",
      });
      return false;
    }
    const validLoginRegExp = /^[a-zA-Zа-яА-Я0-9Ёё]*$/;
    if (!validLoginRegExp.test(userData.login)) {
      mediator.get(WARNING, {
        message: "Логин может содержать символы кириллицы, латиницы и цифры",
        style: "warning",
      });
      return false;
    }
    return true;
  };

  const isNicknameValid = () => {
    if (userData.nickName) {
      const nick = userData.nickName.length;
      if (nick < 3 || nick > 16) {
        mediator.get(WARNING, {
          message: "Никнейм должен содержать от 3 до 16 символов",
          style: "warning",
        });
        return false;
      }
      const validNickRegExp = /^[0-9\p{L}]+$/u;
      if (!validNickRegExp.test(userData.nickName)) {
        mediator.get(WARNING, {
          message: "Никнейм может содержать символы любого языка и цифры",
          style: "warning",
        });
        return false;
      }
      return true;
    }
  };

  const isValidInputs = async (): Promise<boolean> => {
    if (!userData.login || !userData.password || !userData.nickName) {
      mediator.get(WARNING, {
        message: "Заполните все поля",
        style: "warning",
      });
      return false;
    }
    if (isLoginValid() && isNicknameValid() && (await isPasswordValid())) {
      const logRes = await server.registration(
        userData.login,
        userData.nickName ?? "",
        userData.password
      );
      if (!logRes) {
        return false;
      }
      return true;
    }
    return false;
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (await isValidInputs()) {
      setPage("Lobby");
      return;
    }
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
               type="password"
               value={userData.password}
               onChange={(value) => {
                  onChangeHandler(value, "password");
               }}
            />
      </div>
      <div className="errors_div">
        <Alert />
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
