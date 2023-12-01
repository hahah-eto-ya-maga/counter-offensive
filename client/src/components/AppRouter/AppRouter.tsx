import { FC, useContext, useEffect, useState } from "react";
import { Route, RouteProps, Routes, useNavigate } from "react-router-dom";
import { MediatorContext, ServerContext } from "../../App";
import { publicRoutes, privateRoutes } from "../../router";

import "./AppRouter.css";
import { useErrorHandler } from "../../hooks/useErrorHandler";

export const AppRouter: FC = () => {
   const server = useContext(ServerContext);
   const mediator = useContext(MediatorContext);
   const [routes, setRoutes] = useState<RouteProps[]>(
      server.STORE.getToken() ? privateRoutes : publicRoutes
   );
   const navigate = useNavigate();
   const errorHandler = useErrorHandler(mediator, navigate);
   

   useEffect(() => {
      errorHandler();

      const { LOGIN, LOGOUT } = mediator.getTriggerTypes();
      mediator.set(LOGIN, (token: string) => {
         server.STORE.setToken(token);
         setRoutes(server.STORE.getToken() ? privateRoutes : publicRoutes);
         navigate("/");
      });

      mediator.set(LOGOUT, () => {
         server.STORE.setToken(null);
         setRoutes(publicRoutes);
         navigate("/");
      });
   });
   return (
         <Routes>
            {routes.map((route) => {
               return <Route key={route.path} {...route} />;
            })}
         </Routes>
   );
};
