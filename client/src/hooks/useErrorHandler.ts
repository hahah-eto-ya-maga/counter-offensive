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
        case 401: {
          return mediator.get(AUTH_ERROR);
        }
        case 403: {
          return mediator.get(WARNING, {
            message: "Неверный логин или пароль",
            id: "test_error_auth_wrongData",
          });
        }
        case 413: {
          return mediator.get(WARNING, {
            message: "Неверный никнейм",
            id: "test_error_auth_invalid_nickname",
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
        case 234: {
          return mediator.get(ROLE_ERROR, {
            message: "Не дослужился, щенок!",
            id: "test_message_not_enought_level",
          });
        }
        case 235: {
          return mediator.get(ROLE_ERROR, {
            message: "Не мешай отцу играть!",
            id: "test_message_level_less_than_current_general",
          });
        }
        case 237: {
          return mediator.get(ROLE_ERROR, {
            message: "Занято!",
            id: "test_message_place_occupied",
          });
        }
        default: {
          return navigate("/error", { state: { error } });
        }
      }
    });
  };
};
