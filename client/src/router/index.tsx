import { ErrorPage, LoginPage, RegistrationPage } from "../pages";
import { RouteProps } from "react-router-dom";

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
];

export const privateRoutes: RouteProps[] = [];
