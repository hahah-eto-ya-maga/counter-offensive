import { FC, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mediator, Server } from "./modules";
import { IError } from "./modules/Server/types";
import { HOST, MEDIATOR } from "./config";
import { AppRouter } from "./components/AppRouter/AppRouter";

import "./styles/global.css";
import { useErrorHandler } from "./hooks/useErrorHandler";

export const ServerContext = createContext<Server>(null!);
export const MediatorContext = createContext<Mediator>(null!);

const App: FC = () => {
   const mediator = new Mediator(MEDIATOR);
   const server = new Server(HOST, mediator);
   const navigate = useNavigate();
   const errorHandler = useErrorHandler(mediator, navigate);

   useEffect(() => {
      errorHandler();
   }, []);

   return (
      <MediatorContext.Provider value={mediator}>
         <ServerContext.Provider value={server}>
            <AppRouter />
         </ServerContext.Provider>
      </MediatorContext.Provider>
   );
};

export default App;
