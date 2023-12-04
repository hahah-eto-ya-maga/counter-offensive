import { RouteProps } from "react-router-dom";
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
      Component: LoginPage,
   },
   {
      path: "/registration",
      Component: RegistrationPage,
   },
   {
      path: "/authorization",
      Component: LoginPage,
   },
   {
      path: "/error",
      Component: ErrorPage,
   },
   {
      path: "*",
      Component: ErrorPage,
   },
   {
      path: "/lobby",
      Component: LobbyPage,
   },
   {
      path: "/game",
      Component: GamePage,
   },
];

export const privateRoutes: RouteProps[] = [
   {
      path: "*",
      Component: ErrorPage,
   },
   {
      path: "/error",
      Component: ErrorPage,
   },
   {
      path: "/",
      Component: LobbyPage,
   },
   
];
