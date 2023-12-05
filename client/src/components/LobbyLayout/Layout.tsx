import {
   FunctionComponent,
   createContext,
   useContext,
   useEffect,
   useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { ILobbyState } from "../../modules/Server/interfaces";
import { Button, Logo } from "..";
import { General } from "../Lobby";
import { tank2, tank3 } from "../../assets/png";

import { MediatorContext, ServerContext } from "../../App";
import { EHash } from "../../modules/Store/Store";
import "./Layout.css";

export enum ETank {
   heavy,
   middle,
}

export const lobbyContext = createContext<ILobbyState>(null!);

export const withLayout = <T extends Record<string, unknown>>(
   Component: FunctionComponent<T>
) => {
   return (props: T): JSX.Element => {
      const [lobby, setLobby] = useState<ILobbyState>(null!);
      const [tankOpen, setTankOpen] = useState<ETank | null>(null);

      const mediator = useContext(MediatorContext);
      const server = useContext(ServerContext);
      const navigate = useNavigate();
      const location = useLocation();

      const { SWITCH_TANK_LOBBY } = mediator.getTriggerTypes();

      useEffect(() => {
         const interval = setInterval(async () => {
            const res = await server.getLobby();
            if (res && res !== true) {
               server.STORE.setHash(EHash.lobbyHash, res.lobbyHash);
               setLobby(res);
            }
         }, 200);
         return () => {
            server.STORE.setHash(EHash.lobbyHash, null);
            clearInterval(interval);
         };
      }, []);

      useEffect(() => {
         const savedTankOpen = location.state?.tank;

         if (savedTankOpen) {
            setTankOpen(savedTankOpen);
         }
      }, [location.state]);

      const onClickTankHandler = (switchTo: ETank): void => {
         setTankOpen(switchTo);
         mediator.get(SWITCH_TANK_LOBBY);
         navigate("/tanks", {
            state: {
               tank: switchTo,
            },
            replace: tankOpen !== null,
         });
      };

      return (
         <lobbyContext.Provider value={lobby}>
            <div className="lobby_wrapper">
               <Logo />
               <div className="lobby_block">
                  <div className={cn("lobby_units_block", "lobby_main_units")}>
                     <General />
                     {
                        <Button
                           id="test_button_2tank"
                           className={cn("units_item", {
                              tank_selected: tankOpen === ETank.middle,
                           })}
                           appearance="image"
                           onClick={() => onClickTankHandler(ETank.middle)}
                        >
                           Двухместный танк
                           <img src={tank2} alt="Tank_2" />
                        </Button>
                     }
                     <Button
                        id="test_button_3tank"
                        className={cn("units_item", {
                           tank_selected: tankOpen === ETank.heavy,
                        })}
                        appearance="image"
                        onClick={() => onClickTankHandler(ETank.heavy)}
                     >
                        Трёхместный танк
                        <img src={tank3} alt="Tank_3" />
                     </Button>
                  </div>
                  <Component {...props} />
               </div>
            </div>
         </lobbyContext.Provider>
      );
   };
};
