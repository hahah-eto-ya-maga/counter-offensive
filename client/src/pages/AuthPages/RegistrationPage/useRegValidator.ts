import { Mediator, Server } from "../../../modules";
import { IUserInfo } from "../../../modules/Server/interfaces";

const useRegValidator = (mediator: Mediator, server: Server) => {
   const { WARNING } = mediator.getTriggerTypes();

   const isPasswordValid = (pass: string) => {
      const passLength = pass.length;
      if (passLength < 8 || passLength > 20) {
         mediator.get(WARNING, {
            message: "В пароле должно быть от 8 до 20 символов",
            style: "warning",
            id: "test_warning_reg_password_length",
         });
         return false;
      }
      return true;
   };

   const isLoginValid = (login: string) => {
      const loginLength = login.length;
      if (loginLength < 6 || loginLength > 15) {
         mediator.get(WARNING, {
            message: "Логин должен содержать от 6 до 15 символов",
            style: "warning",
            id: "test_warning_reg_login_length",
         });
         return false;
      }
      const validLoginRegExp = /^[a-zA-Zа-яА-Я0-9Ёё]*$/;
      if (!validLoginRegExp.test(login)) {
         mediator.get(WARNING, {
            message:
               "Логин может содержать символы кириллицы, латиницы и цифры",
            style: "warning",
            id: "test_warning_reg_acceptableSymbolsLogin",
         });
         return false;
      }
      return true;
   };

   const isNicknameValid = (nick: string) => {
      if (nick) {
         const nickLength = nick.length;
         if (nickLength < 3 || nickLength > 16) {
            mediator.get(WARNING, {
               message: "Никнейм должен содержать от 3 до 16 символов",
               style: "warning",
               id: "test_warning_reg_nickname_length",
            });
            return false;
         }
         const validNickRegExp = /^[0-9\p{L}]+$/u;
         if (!validNickRegExp.test(nick)) {
            mediator.get(WARNING, {
               message: "Никнейм может содержать символы любого языка и цифры",
               style: "warning",
               id: "test_warning_reg_acceptableSymbolsNickname",
            });
            return false;
         }
         return true;
      }
   };

   return async (
      login: string,
      password: string,
      nick: string
   ): Promise<false | IUserInfo> => {
      if (!login || !password || !nick) {
         mediator.get(WARNING, {
            message: "Заполните все поля",
            style: "warning",
            id: "test_warning_reg_emptyFields",
         });
         return false;
      }

      if (
         isLoginValid(login) &&
         isPasswordValid(password) &&
         isNicknameValid(nick)
      ) {
         const res = await server.registration(login, nick, password);
         if (!res) {
            return false;
         }
         return res;
      }
      return false;
   };
};

export default useRegValidator;
