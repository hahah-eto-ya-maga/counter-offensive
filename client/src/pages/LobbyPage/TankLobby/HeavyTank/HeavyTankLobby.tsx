import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { IHeavyTank, ILobby } from "../../../../modules/Server/interfaces";
import { withLayout } from "../../../../components/LobbyLayout/Layout";
import { Button } from "../../../../components";

import "../TankLobby.css";

const HeavyTankLobby: FC<{ lobby: ILobby | null }> = ({ lobby }) => {
   const [tanks, setTanks] = useState<IHeavyTank[]>([]);
   const navigate = useNavigate();

   useEffect(() => {
      lobby && setTanks(lobby.tanks.heavyTank);
   }, [lobby]);

   const addTankHandler = () => {
      navigate("/heavy_tanks/myTank");
   };

   const selectTankHandler = (id: number) => {
      navigate(`/heavy_tanks/${id}`);
   };

   const goBack = () => {
      navigate("/");
   };

   return (
      <div className="tank_lobby">
         <div className="tank_lobby_list">
            <div className="tank_lobby_btns">
               <Button
                  appearance="primary"
                  id="test_button_add_tank"
                  onClick={addTankHandler}
               >
                  Добавить танк
               </Button>
               <Button
                  appearance="primary"
                  id="test_button_back_to_lobby"
                  onClick={goBack}
               >
                  Назад
               </Button>
            </div>
            {tanks.map((tank) => (
               <div
                  className="tank_list_el"
                  key={tank.id}
                  onClick={() => selectTankHandler(tank.id)}
               >
                  <div>Танк №{tank.id}</div>
                  <div className="tank_list_circles">
                     <div
                        className={cn("tank_circle", {
                           tank_circle_occupied: tank.Commander,
                        })}
                     />
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
      </div>
   );
};

export default withLayout(HeavyTankLobby);
