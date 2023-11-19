import { FC, useContext, useEffect, useState } from "react";
import { Route, RouteProps, Routes, useNavigate } from "react-router-dom";
import { publicRoutes, privateRoutes } from "../../router";
import { MediatorContext, ServerContext } from "../../App";

import "./AppRouter.css";
import { IError } from "../../modules/Server/types";
import { ServerWarnings } from "../../interfaces";

export const AppRouter: FC = () => {
  const [routes, setRoutes] = useState<RouteProps[]>(publicRoutes);
  const server = useContext(ServerContext);
  useEffect(() => {
    setRoutes(server.STORE.token ? privateRoutes : publicRoutes);
  }, [server.STORE.token]);

  const mediator = useContext(MediatorContext);
  const navigate = useNavigate();
  const { SERVER_ERROR } = mediator.getEventTypes();
  const { WARNING, ERROR } = mediator.getTriggerTypes();
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
    mediator.get(ERROR, error);
    navigate("/error");
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
