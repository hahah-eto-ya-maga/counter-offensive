import React, { useContext, useState } from "react";
import { Button, Input } from "../../UI";
import { ISetPage, IUserData } from "../../../interfaces";
import "../../../pages/RegistrationPage/RegistrationPage.css";
import { ServerContext } from "../../../App";

const Registration: React.FC<ISetPage> = ({ setPage }) => {
   const server = useContext(ServerContext);

   const [userData, setUserData] = useState<IUserData>({
      login: "",
      password: "",
      nickName: "",
   });

   const onChangeHandler = (value: string, data: string) => {
      setUserData({ ...userData, [data]: value });
   };

   const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      server.registration(userData.login, userData.password);
      //setPage("Lobby");
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
