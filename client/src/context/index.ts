import { createContext } from "react";
import Server from "../modules/Server/Server";
import { HOST } from "../config";

export const ServerContext = createContext<Server>(new Server(HOST));
