import { Navigate, RouteProps } from "react-router-dom";
import {
   ErrorPage,
   GamePage,
   LobbyInfo,
   LoginPage,
   RegistrationPage,
   HeavyTankLobby,
   MiddleTankLobby,
   HeavyTankDetail,
   MiddleTankDetail,
} from "../pages";

export const publicRoutes: RouteProps[] = [
   {
      path: "/",
      element: <LoginPage />,
   },
   {
      path: "/authorization",
      element: <LoginPage />,
   },
   {
      path: "/registration",
      element: <RegistrationPage />,
   },
   {
      path: "/error",
      element: <ErrorPage />,
   },
   {
      path: "*",
      element: <Navigate to="/" replace />,
   },
];

export const privateRoutes: RouteProps[] = [
   {
      path: "/",
      element: <LobbyInfo />,
   },
   {
      path: "/lobby",
      element: <LobbyInfo />,
   },
   {
      path: "/heavy_tanks",
      element: <HeavyTankLobby />,
   },
   {
      path: "/middle_tanks",
      element: <MiddleTankLobby />,
   },
   {
      path: "/heavy_tanks/:id",
      element: <HeavyTankDetail />,
   },
   {
      path: "/middle_tanks/:id",
      element: <MiddleTankDetail />,
   },
   {
      path: "/game",
      element: <GamePage />,
   },
   {
      path: "/error",
      element: <ErrorPage />,
   },
   {
      path: "*",
      element: <Navigate to="/" replace />,
   },
];
