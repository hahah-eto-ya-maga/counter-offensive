import { FC, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mediator, Server } from "./modules";
import { HOST, MEDIATOR } from "./config";
import { ServerWarnings } from "./interfaces";
import { AppRouter } from "./components/AppRouter/AppRouter";
import { IError } from "./modules/Server/types";

import "./styles/global.css";

export const ServerContext = createContext<Server>(null!);
export const MediatorContext = createContext<Mediator>(null!);

const App: FC = () => {
   const mediator = new Mediator(MEDIATOR);
   const server = new Server(HOST, mediator);
   const navigate = useNavigate();

   useEffect(() => {
      const { SERVER_ERROR } = mediator.getEventTypes();
      const { WARNING } = mediator.getTriggerTypes();

      mediator.subscribe(SERVER_ERROR, (error: IError & { id?: string }) => {
         const exeptions: number[] = ServerWarnings.map((el) => el.code);
         if (exeptions.includes(error.code)) {
            const warning = ServerWarnings.find((el) => el.code === error.code);
            if (warning) {
               mediator.get(WARNING, {
                  message: warning.text,
                  id: warning.id,
                  style: "error",
               });
               return;
            }
         }
         navigate("/error", { state: { error } });
      });
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
