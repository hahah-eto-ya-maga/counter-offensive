import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MediatorContext } from "../App";
import { IError } from "../modules/Server/interfaces";

export const useErrorHandler = () => {
   const mediator = useContext(MediatorContext);
   const navigate = useNavigate();
   const { SERVER_ERROR } = mediator.getEventTypes();
   const { WARNING, AUTH_ERROR, ROLE_ERROR } = mediator.getTriggerTypes();
   return () => {
      mediator.subscribe(SERVER_ERROR, (error: IError) => {
         switch (error.code) {
            case 403: {
               return mediator.get(WARNING, {
                  message: "Неверный логин или пароль",
                  id: "test_error_auth_wrongData",
               });
            }
            case 460: {
               return mediator.get(WARNING, {
                  message: "Логин занят",
                  id: "test_error_reg_loginOccupied",
               });
            }
            case 461: {
               return mediator.get(WARNING, {
                  message: "Пользователя с таким логином не существует",
                  id: "test_error_auth_userNotExist",
               });
            }
            case 401: {
               return mediator.get(AUTH_ERROR);
            }
            case 234: {
               return mediator.get(ROLE_ERROR, "Не дослужился, щенок!");
            }
            default: {
               return navigate("/error", { state: { error } });
            }
         }
      });
   };
};
