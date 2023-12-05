import { FC, useContext, useEffect, useState } from "react";
import { Route, RouteProps, Routes, useNavigate } from "react-router-dom";
import { MediatorContext, ServerContext } from "../../App";
import { publicRoutes, privateRoutes } from "../../router";
import { IError } from "../../modules/Server/types";
import { ServerWarnings } from "../../interfaces";

import "./AppRouter.css";

export const AppRouter: FC = () => {
   const server = useContext(ServerContext);
   const mediator = useContext(MediatorContext);
   const [routes, setRoutes] = useState<RouteProps[]>(
      server.STORE.token ? privateRoutes : publicRoutes
   );
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
         navigate("/error");
      });
   }, []);

   useEffect(() => {
      const { TOKEN_UPDATE } = mediator.getTriggerTypes();
      mediator.set(TOKEN_UPDATE, (token: string | null) => {
         server.setToken(token);
         setRoutes(token ? privateRoutes : publicRoutes);
         navigate("/");
      });
   }, []);
   return (
      <div className="router_block">
         <Routes>
            {routes.map((route) => {
               return <Route key={route.path} {...route} />;
            })}
         </Routes>
      </div>
   );
};
