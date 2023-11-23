import { NavigateFunction } from "react-router-dom";
import { Mediator } from "../modules";
import { IError } from "../modules/Server/types";

export const useErrorHandler = (
   mediator: Mediator,
   navigate: NavigateFunction
) => {
   const { SERVER_ERROR } = mediator.getEventTypes();
   const { WARNING } = mediator.getTriggerTypes();
   return () => {
      mediator.subscribe(SERVER_ERROR, (error: IError & { id?: string }) => {
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
         }

         navigate("/error", { state: { error } });
      });
   };
};
