import { Navigate, RouteProps } from "react-router-dom";
import {
  ErrorPage,
  GamePage,
  LobbyPage,
  LoginPage,
  RegistrationPage,
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
      element: <LobbyPage />,
   },
   {
      path: "/lobby",
      element: <LobbyPage />,
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
