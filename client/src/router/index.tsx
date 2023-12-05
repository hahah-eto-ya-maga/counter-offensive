import { Navigate, RouteProps } from "react-router-dom";
import {
   ErrorPage,
   GamePage,
   LobbyInfo,
   LoginPage,
   RegistrationPage,
   TankLobby,
} from "../pages";

export const publicRoutes: RouteProps[] = [
   {
      path: "/",
      // element: <LobbyPage />,
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
      path: "/tanks",
      element: <TankLobby />,
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
