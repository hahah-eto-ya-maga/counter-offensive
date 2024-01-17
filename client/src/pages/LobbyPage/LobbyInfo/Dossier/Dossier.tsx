import { FC, useContext } from "react";
import cn from "classnames";
import { ServerContext } from "../../../../App";
import { ERank, IUserInfo } from "../../../../modules/Server/interfaces";
import { Button } from "../../../../components";

import DossierImage from "./dossierImage.png";
import "./Dossier.css";

export const Dossier: FC = () => {
   const server = useContext(ServerContext);
   const { nickname, rank_name, gamer_exp, next_rang } = server.STORE
      .user as IUserInfo;

   const rank = (rankName: ERank) => {
      switch (rankName) {
         case ERank.General: {
            return "Генерал";
         }
         case ERank.Officer: {
            return "Офицер";
         }
         case ERank.Private: {
            return "Рядовой";
         }
         case ERank.Sergeant: {
            return "Сержант";
         }
      }
   };

   const expCalc = (): number => {
      const persent = gamer_exp / (gamer_exp + next_rang);
      if (persent >= 1) {
         return 1;
      }
      return persent;
   };

   const expString = (): string => {
      if (next_rang <= 0) {
         return `${gamer_exp}`;
      }
      return `${gamer_exp}/${gamer_exp + next_rang}`;
   };

   return (
      <div className="dossier">
         <div className="dossier_user">
            <div className="dossier_image">
               <img src={DossierImage} />
            </div>
            <div className="dossier_info">
               <p className="user_name">{nickname}</p>
               <p className="user_rang">{rank(rank_name)}</p>
            </div>
            <Button
               id="test_button_showcaseOfAchievements"
               appearance="primary"
               className="achievements_button"
            >
               Витрина достижений
            </Button>
         </div>
         <div className="dossier_exp_progress">
            <div className="dossier_exp_progress_bar">
               <div
                  className={cn("exp_progress", {
                     exp_progress_full: expCalc() === 1,
                  })}
                  style={{
                     width: `${expCalc() * 100}%`,
                  }}
               />
               <span>{expString()}</span>
            </div>
         </div>
      </div>
   );
};
