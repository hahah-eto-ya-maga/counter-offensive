import { Mediator, Server } from "../../../modules";
import { IToken } from "../../../modules/Server/interfaces";

const useLoginValidator = (mediator: Mediator, server: Server) => {
   const { WARNING } = mediator.getTriggerTypes();

   return async (login: string, password: string): Promise<false | IToken> => {
      if (!login || !password) {
         mediator.get(WARNING, {
            message: "Заполните все поля",
            style: "warning",
            id: "test_warning_auth_emptyFields",
         });
         return false;
      }

      const res = await server.login(login, password);

      //Если сервер вернут null то отработает хук useErrorHandler
      if (!res) {
         return false;
      }
      return res;
   };
};

export default useLoginValidator;
