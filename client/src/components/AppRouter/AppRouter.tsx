import { FC, useContext, useEffect, useState } from "react";
import { Route, RouteProps, Routes, useNavigate } from "react-router-dom";
import { MediatorContext, ServerContext } from "../../App";
import { publicRoutes, privateRoutes } from "../../router";

import "./AppRouter.css";

export const AppRouter: FC = () => {
   const server = useContext(ServerContext);
   const mediator = useContext(MediatorContext);
   const [routes, setRoutes] = useState<RouteProps[]>(
      server.STORE.token ? privateRoutes : publicRoutes
   );
   const navigate = useNavigate();

   useEffect(() => {
      const { TOKEN_UPDATE } = mediator.getTriggerTypes();
      mediator.set(TOKEN_UPDATE, (token: string | null) => {
         server.setToken(token);
         setRoutes(token ? privateRoutes : publicRoutes);
         navigate("/");
      });
   });
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
