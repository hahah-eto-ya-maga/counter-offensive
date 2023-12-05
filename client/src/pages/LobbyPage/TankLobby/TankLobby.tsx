import { FC, useContext, useEffect, useState } from "react";
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
import { MediatorContext } from "../../../App";

const Lobby: FC = () => {
   const [tankOpen, setTankOpen] = useState<IHeavyTank | IMiddleTank | null>(
      null
   );
   const lobby = useContext(lobbyContext);
   const mediator = useContext(MediatorContext);
   const { state }: { state: { tank: ETank } } = useLocation();
   const { SWITCH_TANK_LOBBY } = mediator.getTriggerTypes();

   useEffect(() => {
      mediator.set(SWITCH_TANK_LOBBY, () => {
         closeTankDetail();
      });
   });

   const tankType = state?.tank;

   const tankArr: IHeavyTank[] | IMiddleTank[] =
      tankType === ETank.heavy
         ? lobby?.tanks.heavyTank
         : lobby?.tanks.middleTank;

   const addTankHandler = () => {
      
      const newTank: IMiddleTank | IHeavyTank = {
         id: 1,
         Mechanic: false,
         Gunner: false,
      };

      if (tankType === ETank.heavy) {
         (newTank as IHeavyTank).Commander = false;
      }
      setTankOpen(newTank);
   };

   const closeTankDetail = (): void => {
      setTankOpen(null);
   };

   const selectTankHandler = (tank: IHeavyTank | IMiddleTank): void => {
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
               <div className="tank_lobby_add" onClick={addTankHandler}>
                  Добавить танк
               </div>
               {tankArr?.map((tank) => (
                  <div
                     className="tank_list_el"
                     key={tank.id}
                     onClick={() => selectTankHandler(tank)}
                  >
                     <div>Танк №{tank.id}</div>
                     <div className="tank_list_circles">
                        {tankType === ETank.heavy && (
                           <div
                              className={cn("tank_circle", {
                                 tank_circle_occupied: (tank as IHeavyTank)
                                    .Commander,
                              })}
                           />
                        )}
                        <div
                           className={cn("tank_circle", {
                              tank_circle_occupied: tank.Gunner,
                           })}
                        />
                        <div
                           className={cn("tank_circle", {
                              tank_circle_occupied: tank.Mechanic,
                           })}
                        />
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};

export const TankLobby = withLayout(Lobby);
