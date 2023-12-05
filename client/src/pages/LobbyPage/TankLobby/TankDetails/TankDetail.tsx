import { FC } from "react";
import cn from "classnames";
import { IHeavyTank, IMiddleTank } from "../../../../modules/Server/interfaces";
import { ETank } from "../../../../components/LobbyLayout/Layout";

import { ReactComponent as MiddleTank } from "./middleTank.svg";
import { ReactComponent as HeavyTank } from "./heavyTank.svg";
import CrossIcon from "./closeIcon.png";

import "./TankDetail.css";

interface TankDetProps {
   tank: IHeavyTank | IMiddleTank;
   closeDetail: () => void;
   tankType: ETank;
}

const TankDetail: FC<TankDetProps> = ({ tank, closeDetail, tankType }) => {
   const calcPlaces = (): string => {
      const placesCount = tankType === ETank.middle ? 2 : 3;
      var occupiedPlacesCount = 0;
      !tank.Gunner && occupiedPlacesCount++;
      !tank.Mechanic && occupiedPlacesCount++;
      tankType === ETank.heavy &&
         !(tank as IHeavyTank).Commander &&
         occupiedPlacesCount++;

      return `${occupiedPlacesCount}/${placesCount}`;
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
               className={cn("tank_driver", {
                  tank_available_role: tank.Mechanic,
               })}
            >
               МехВод
            </div>
            <div
               className={cn("tank_gunner", {
                  tank_available_role: tank.Gunner,
               })}
            >
               Наводчик
            </div>
            {tankType === ETank.heavy && (
               <div
                  className={cn("tank_commander", {
                     tank_available_role: (tank as IHeavyTank).Commander,
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
         {/* круглешочки (ТОТАЛ ПИЗДААААА) */}
      </div>
   );
};

export default TankDetail;
