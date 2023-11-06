import React, { createContext } from "react";
import { PageHandler } from "./pages";
import { Mediator, Server, Store } from "./modules";
import { HOST, MEDIATOR } from "./config";
import "./styles/global.css";
import { LoadingPage,TankTwoLobbyPage, GamePage } from "./pages";

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
          <TankTwoLobbyPage/>
        </div>
      </ServerContext.Provider>
    </MediatorContext.Provider>
  );
};

export default App;
