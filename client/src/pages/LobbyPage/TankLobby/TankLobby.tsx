import { FC, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";
import { IHeavyTank, IMiddleTank } from "../../../modules/Server/interfaces";
import {
   ETank,
   lobbyContext,
   withLayout,
} from "../../../components/LobbyLayout/Layout";
import TankDetail from "./TankDetails/TankDetail";

import "./TankLobby.css";

const Lobby: FC = () => {
   const [tankOpen, setTankOpen] = useState<IHeavyTank | IMiddleTank | null>(
      null
   );
   const { lobby } = useContext(lobbyContext);
   const { state }: { state: { tank: ETank } } = useLocation();
   const tankType = state?.tank ?? ETank.middle;

   const tankArr: IHeavyTank[] | IMiddleTank[] = [
      { id: 1, Mechanic: false, Gunner: true },
      { id: 2, Mechanic: true, Gunner: true },
   ];
   /* tankType === ETank.heavy ? lobby.tanks.heavyTank : lobby.tanks.middleTank; */

   const closeTankDetail = () => {
      setTankOpen(null);
   };

   const selectTankHandler = (tank: IHeavyTank | IMiddleTank) => {
      setTankOpen(tank);
   };

   return (
      <div className="tank_lobby">
         {tankOpen ? (
            <TankDetail
               tank={tankOpen}
               tankType={tankType}
               closeDetail={closeTankDetail}
            />
         ) : (
            <div className="tank_lobby_list">
               {tankArr.map((tank) => (
                  <div
                     className="tank_list_el"
                     key={tank.id}
                     onClick={() => selectTankHandler(tank)}
                  >
                     <div>Танк № {tank.id}</div>
                     <div className="tank_list_circles">
                        <div
                           className={cn("tank_circle", {
                              tank_circle_free: tank.Gunner,
                           })}
                        />
                        <div
                           className={cn("tank_circle", {
                              tank_circle_free: tank.Mechanic,
                           })}
                        />
                        {tankType === ETank.heavy && (
                           <div
                              className={cn("tank_circle", {
                                 tank_circle_free: (tank as IHeavyTank)
                                    .Commander,
                              })}
                           />
                        )}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export const TankLobby = withLayout(Lobby);
