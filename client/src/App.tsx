import React, { createContext } from "react";
import { GamePage, LobbyPage, PageHandler } from "./pages";
import { Mediator, Server, Store } from "./modules";
import { HOST, MEDIATOR } from "./config";
import "./styles/global.css";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

export const ServerContext = createContext<Server>(null!);
export const MediatorContext = createContext<Mediator>(null!);

const App: React.FC = () => {
   const mediator = new Mediator(MEDIATOR);
   const store = new Store();
   const server = new Server(HOST, mediator);

   return (
      <MediatorContext.Provider value={mediator}>
         <ServerContext.Provider value={server}>
            <div className="app">
               <LobbyPage/>
            </div>
         </ServerContext.Provider>
      </MediatorContext.Provider>
   );
};

export default App;
