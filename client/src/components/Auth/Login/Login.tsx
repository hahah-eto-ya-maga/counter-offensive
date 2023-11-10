import React, { useContext, useState } from "react";
import { ServerContext } from "../../../App";
import { Button, Input } from "../../UI";
import { IUserData, ISetPage } from "../../../interfaces";
import "../../../pages/MainPage/MainPage.css";

const Login: React.FC<ISetPage> = ({ setPage }) => {
   const [userData, setUserData] = useState<IUserData>({
      login: "",
      password: "",
   });

   const server = useContext(ServerContext);

   const onChangeHandler = (value: string, data: string) => {
      setUserData({ ...userData, [data]: value });
   };

   const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (true) {
         const res = await server.login(userData.login, userData.password);
         if (res) {
            setPage("Lobby");
         }
         return;
      }
      //обработка ошибок
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
               id="test_login_submit_button"
            >
               Пойти на Бахмут
            </Button>
         </div>
      </form>
   );
};

export default Login;
