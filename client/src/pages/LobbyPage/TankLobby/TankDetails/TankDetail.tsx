import { FC, useContext } from "react";
import cn from "classnames";
import {
   EGamerRole,
   IHeavyTank,
   IMiddleTank,
} from "../../../../modules/Server/interfaces";
import { ETank } from "../../../../components/LobbyLayout/Layout";

import { ReactComponent as MiddleTank } from "./middleTank.svg";
import { ReactComponent as HeavyTank } from "./heavyTank.svg";
import CrossIcon from "./closeIcon.png";

import "./TankDetail.css";
import { ServerContext } from "../../../../App";

interface TankDetProps {
   tank: IHeavyTank | IMiddleTank;
   closeDetail: () => void;
   tankType: ETank;
}

const TankDetail: FC<TankDetProps> = ({ tank, closeDetail, tankType }) => {
   const server = useContext(ServerContext);

   const calcPlaces = (): string => {
      const placesCount = tankType === ETank.middle ? 2 : 3;
      var occupiedPlacesCount = 0;
      tank.Gunner && occupiedPlacesCount++;
      tank.Mechanic && occupiedPlacesCount++;
      tankType === ETank.heavy &&
         (tank as IHeavyTank).Commander &&
         occupiedPlacesCount++;

      return `${occupiedPlacesCount}/${placesCount}`;
   };

   const setRole = async (role: EGamerRole) => {
      const res = await server.setGamerRole(role, tank.id);
   };

   return (
      <div className="tank_details">
         <div className="tank_info">
            <p>
               {tankType === ETank.middle
                  ? "Двухместный танк"
                  : "Трёхместный танк"}
            </p>
            <p>Танк {tank.id}</p>
            <p>Занято мест {calcPlaces()}</p>
         </div>
         <div
            className={cn("tank_svg_wrapper", {
               middle_tank: tankType === ETank.middle,
               heavy_tank: tankType === ETank.heavy,
            })}
         >
            <div
               onClick={() =>
                  setRole(
                     tankType === ETank.middle
                        ? EGamerRole.middleTankMeh
                        : EGamerRole.heavyTankMeh
                  )
               }
               className={cn("tank_driver", {
                  tank_unavailable_role: tank.Mechanic,
               })}
            >
               МехВод
            </div>
            <div
               onClick={() =>
                  setRole(
                     tankType === ETank.middle
                        ? EGamerRole.middleTankGunner
                        : EGamerRole.heavyTankGunner
                  )
               }
               className={cn("tank_gunner", {
                  tank_unavailable_role: tank.Gunner,
               })}
            >
               Наводчик
            </div>
            {tankType === ETank.heavy && (
               <div
                  onClick={() => setRole(EGamerRole.heavyTankCommander)}
                  className={cn("tank_commander", {
                     tank_unavailable_role: (tank as IHeavyTank).Commander,
                  })}
               >
                  Командир
               </div>
            )}
            {tankType === ETank.heavy && <HeavyTank />}
            {tankType === ETank.middle && <MiddleTank />}
         </div>
         <img
            className="tank_lobby_close"
            src={CrossIcon}
            alt="Закрыть"
            onClick={closeDetail}
         />
      </div>
   );
};

export default TankDetail;
