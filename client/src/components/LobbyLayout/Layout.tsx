import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { EGamerRole, ILobby } from "../../modules/Server/interfaces";
import { Button, Logo } from "..";
import { tank2, tank3, general } from "../../assets/png";

import { MediatorContext, ServerContext } from "../../App";
import { EHash } from "../../modules/Store/Store";
import "./Layout.css";

export enum ETank {
   heavy,
   middle,
}

export const withLayout = (
   Component: FunctionComponent<{ lobby: ILobby | null }>
) => {
   return (): JSX.Element => {
      const [lobby, setLobby] = useState<ILobby | null>(null);

      const mediator = useContext(MediatorContext);
      const server = useContext(ServerContext);
      const navigate = useNavigate();
      const location = useLocation();

      const { LOBBY_UPDATE } = mediator.getEventTypes();

      const path = location.pathname.split("/")[1];

      useEffect(() => {
         const interval = setInterval(async () => {
            const res = await server.getLobby();
            if (res && res !== true) {
               server.STORE.setHash(EHash.lobbyHash, res.lobbyHash);
               setLobby(res.lobby);
               lobby && mediator.call(LOBBY_UPDATE, lobby);
            }
         }, 100);
         return () => {
            server.STORE.setHash(EHash.lobbyHash, null);
            clearInterval(interval);
         };
      }, []);

      const onClickTankLobbyHandler = (switchTo: ETank): void => {
         const replace: boolean =
            path === "heavy_tanks" || path === "middle_tanks";

         switch (switchTo) {
            case ETank.heavy: {
               return navigate("/heavy_tanks", { replace });
            }
            case ETank.middle: {
               return navigate("/middle_tanks", { replace });
            }
         }
      };

      const setGeneralHandler = async () => {
         const res = await server.setGamerRole(EGamerRole.general);
      };

      return (
         <div className="lobby_wrapper">
            <Logo />
            <div className="lobby_block">
               <div className={cn("lobby_units_block", "lobby_main_units")}>
                  <Button
                     id="test_button_general"
                     className={cn("general units_item", {
                        selected_role: lobby?.general.occupied,
                     })}
                     appearance="image"
                     onClick={setGeneralHandler}
                  >
                     Генерал
                     <img src={general} alt="General" />
                  </Button>
                  <Button
                     id="test_button_2tank"
                     className={cn("units_item", {
                        tank_selected: path === "middle_tanks",
                     })}
                     appearance="image"
                     onClick={() => onClickTankLobbyHandler(ETank.middle)}
                  >
                     Двухместный танк
                     <img src={tank2} alt="Tank_2" />
                  </Button>
                  <Button
                     id="test_button_3tank"
                     className={cn("units_item", {
                        tank_selected: path === "heavy_tanks",
                     })}
                     appearance="image"
                     onClick={() => onClickTankLobbyHandler(ETank.heavy)}
                  >
                     Трёхместный танк
                     <img src={tank3} alt="Tank_3" />
                  </Button>
               </div>
               <Component lobby={lobby} />
            </div>
         </div>
      );
   };
};
