import React from "react";
import { useServer } from "./modules";
import { HOST } from "./config";
import { ServerContext } from "./context";

const App: React.FC = () => {
   const server = useServer(HOST);
   return (
      <ServerContext.Provider value={server}>
         <div className="app">
         </div>
      </ServerContext.Provider>
   );
};

export default App;
