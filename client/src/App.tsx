import React, { createContext } from "react";
import { PageHandler } from "./pages";
import { Mediator, Server, Store } from "./modules";
import { HOST, MEDIATOR } from "./config";
import "./styles/global.css";

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
          <button
            onClick={() => {
              server.registration("vasadastya", "1234214213dsadas");
            }}
          >
            КЛИК
          </button>
        </div>
      </ServerContext.Provider>
    </MediatorContext.Provider>
  );
};

export default App;
