import React, { createContext } from "react";
import { Mediator, Server } from "./modules";
import { HOST, MEDIATOR } from "./config";
import { AppRouter } from "./components/AppRouter/AppRouter";
import "./styles/global.css";

export const ServerContext = createContext<Server>(null!);
export const MediatorContext = createContext<Mediator>(null!);

const App: React.FC = () => {
  const mediator = new Mediator(MEDIATOR);
  const server = new Server(HOST, mediator);

  return (
    <MediatorContext.Provider value={mediator}>
      <ServerContext.Provider value={server}>
        <AppRouter />
      </ServerContext.Provider>
    </MediatorContext.Provider>
  );
};

export default App;
