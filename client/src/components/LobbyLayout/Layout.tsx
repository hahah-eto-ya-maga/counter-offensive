import { FunctionComponent, createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { ILobby } from "../../modules/Server/interfaces";
import { Button, Logo } from "..";
import { General } from "../Lobby";
import { tank2, tank3 } from "../../assets/png";

import "./Layout.css";

export enum ETank {
   heavy,
   middle,
}

export const lobbyContext = createContext<{ lobby: ILobby }>(null!);

export const withLayout = <T extends Record<string, unknown>>(
   Component: FunctionComponent<T>
) => {
   return (props: T): JSX.Element => {
      const [lobby, setLobby] = useState<ILobby>(null!);
      const [tankOpen, setTankOpen] = useState<ETank | null>(null);

      const navigate = useNavigate();
      const location = useLocation();

      useEffect(() => {
         /* const interval = setInterval(() => {
            //Вызываем гет лобби.
            // Проверяем изменилось ли оно меняем / не меняем
            // if (123) {
            //    setLobby(null);
            // }
         }, 200);
         return () => clearInterval(interval); */
      }, []);

      useEffect(() => {
         const savedTankOpen = location.state?.tank;

         if (savedTankOpen) {
            setTankOpen(savedTankOpen);
         }
      }, [location.state]);

      const onClickTankHandler = (switchTo: ETank): void => {
         setTankOpen(switchTo);
         navigate("/tanks", {
            state: {
               tank: switchTo,
            },
            replace: tankOpen !== null,
         });
      };

      return (
         <lobbyContext.Provider
            value={{
               lobby,
            }}
         >
            <div className="lobby_wrapper">
               <Logo />
               <div className="lobby_block">
                  <div className={cn("lobby_units_block", "lobby_main_units")}>
                     <General />
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
