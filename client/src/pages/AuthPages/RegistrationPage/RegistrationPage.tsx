import { FC, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Input, Logo } from "../../../components";
import { MediatorContext, ServerContext } from "../../../App";
import { IUserData } from "../userData.interface";

import "../AuthPage.css";
import useRegValidator from "./useRegValidator";

const RegistrationPage: FC = () => {
   const [userData, setUserData] = useState<IUserData>({
      login: "",
      password: "",
      nickName: "",
   });
   const server = useContext(ServerContext);
   const mediator = useContext(MediatorContext);

   const validator = useRegValidator(mediator, server);

   const { LOGIN } = mediator.getTriggerTypes();

   const onChangeHandler = (value: string, data: string) => {
      setUserData({ ...userData, [data]: value });
   };

   const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const login = userData.login.trim();
      const pass = userData.password.trim();
      const nick = userData.nickName?.trim();
      const res = await validator(login, pass, nick ?? "");
      if (res) {
         mediator.get(LOGIN, res);
      }
   };

   return (
      <div className="auth_wrapper">
         <Logo />
         <div className="auth_title" id="test_auth_reg_title">
            Повестка
         </div>
         <form className="auth_form" onSubmit={onSubmitHandler}>
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
            <div className="auth_footer">
               <Link to="/authorization" tabIndex={-1}>
                  <Button
                     appearance="primary"
                     className="auth_switch_page"
                     id="test_login_go_log_button"
                  >
                     Уже служил
                  </Button>
               </Link>
               <Button
                  appearance="primary"
                  className="reg_submit_button"
                  id="test_reg_submit_button"
               >
                  Попасть в списки военных
               </Button>
            </div>
         </form>
      </div>
   );
};

export default RegistrationPage;
