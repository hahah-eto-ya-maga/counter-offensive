import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cn from "classnames";
import { useSetRoleHandler } from "../../../../hooks/useSetRoleHandler";
import { ServerContext } from "../../../../App";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import {
   EGamerRole,
   IHeavyTank,
   ILobby,
} from "../../../../modules/Server/interfaces";

import { ReactComponent as HeavyTank } from "./heavyTank.svg";
import CrossIcon from "../closeIcon.png";

import "../TankDetail.css";

const HeavyTankDetail: FC<{ lobby: ILobby | null }> = ({ lobby }) => {
   const [tank, setTank] = useState<IHeavyTank>({
      Commander: false,
      Gunner: false,
      Mechanic: false,
      id: 0,
   });
   const server = useContext(ServerContext);
   const navigate = useNavigate();
   const params = useParams();
   const setRoleHandler = useSetRoleHandler();

   useEffect(() => {
      const id = Number(params.id);
      if (id) {
         const newTank = lobby?.tanks.heavyTank.find((tank) => tank.id === id);
         if (newTank) {
            return setTank(newTank);
         }
      }
      setTank({
         ...tank,
         id: Number(`2${server.STORE.user?.id}`),
      });
   }, [lobby]);

   const goBack = () => {
      navigate("/heavy_tanks");
   };

   const calcPlaces = (): string => {
      const placesCount = 3;
      var occupiedPlacesCount = 0;
      tank.Gunner && occupiedPlacesCount++;
      tank.Mechanic && occupiedPlacesCount++;
      tank.Commander && occupiedPlacesCount++;

      return `${occupiedPlacesCount}/${placesCount}`;
   };

   return (
      <div className="tank_details">
         <div className="tank_info">
            <p>Трёхместный танк</p>
            <p>Танк {tank.id}</p>
            <p>Занято мест {calcPlaces()}</p>
         </div>
         <div className={cn("tank_svg_wrapper", "heavy_tank")}>
            <div
               id="test_button_tankDriver3"
               onClick={() => setRoleHandler(EGamerRole.heavyTankMeh, tank.id)}
               className={cn("tank_driver", {
                  tank_unavailable_role: tank.Mechanic,
               })}
            >
               МехВод
            </div>
            <div
               id="test_button_shooter3"
               onClick={() =>
                  setRoleHandler(EGamerRole.heavyTankGunner, tank.id)
               }
               className={cn("tank_gunner", {
                  tank_unavailable_role: tank.Gunner,
               })}
            >
               Наводчик
            </div>
            <div
               id="test_button_tank_commander"
               onClick={() =>
                  setRoleHandler(EGamerRole.heavyTankCommander, tank.id)
               }
               className={cn("tank_commander", {
                  tank_unavailable_role: tank.Commander,
               })}
            >
               Командир
            </div>
            <HeavyTank />
         </div>
         <img
            id={"test_button_cross"}
            className="tank_lobby_close"
            src={CrossIcon}
            alt="Закрыть"
            onClick={goBack}
         />
      </div>
   );
};

export default withLayout(HeavyTankDetail);
