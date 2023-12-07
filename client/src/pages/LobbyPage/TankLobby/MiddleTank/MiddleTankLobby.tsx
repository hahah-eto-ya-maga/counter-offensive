import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ILobby, IMiddleTank } from "../../../../modules/Server/interfaces";
import cn from "classnames";
import { withLayout } from "../../../../components/LobbyLayout/Layout";

import "../TankLobby.css";
import { Button } from "../../../../components";

const MiddleTankLobby: FC<{ lobby: ILobby | null }> = ({ lobby }) => {
   const [tanks, setTanks] = useState<IMiddleTank[]>([]);
   const navigate = useNavigate();

   useEffect(() => {
      lobby && setTanks(lobby.tanks.middleTank);
   }, [lobby]);

   const addTankHandler = () => {
      navigate("/middle_tanks/myTank");
   };

   const selectTankHandler = (id: number) => {
      navigate(`/middle_tanks/${id}`);
   };

   const goBack = () => {
      navigate("/");
   };

   return (
      <div className="tank_lobby">
         <div className="tank_lobby_list">
            <div className="tank_lobby_btns">
               <Button appearance="primary" onClick={addTankHandler}>
                  Добавить танк
               </Button>
               <Button appearance="primary" onClick={goBack}>
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

export default withLayout(MiddleTankLobby);
