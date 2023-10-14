import React, { useState } from "react";
import { Button, Input } from "../UI";
import { IUserData } from "../../interfaces";

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
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
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
       {/*  <div>ТУТ ОШИБКИ МОЖНО ЗАКИНУТЬ ЕСЛИ НАСТРОИТЬ КСС ку</div> */}
      </div>
      <div className="auth_footer">
        <Button appearance="primary" className="auth_submit_button">
          Войти в Бахмут
        </Button>
      </div>
    </form>
  );
};

export default Login;
