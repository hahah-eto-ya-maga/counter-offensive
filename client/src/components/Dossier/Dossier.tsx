import { FC, useContext } from "react";
import { ServerContext } from "../../App";
import { Button } from "../UI";
import { IUserInfo } from "../../modules/Server/interfaces";
import "./Dossier.css";

export const Dossier: FC = () => {
   const server = useContext(ServerContext);
   const { nickname, rank_name, gamer_exp, next_rang } = server.STORE
      .user as IUserInfo;
   return (
      <div className="dossier">
         <div className="dossier_user">
            <div className="dossier_image">
               <img src="https://i.ibb.co/BggNK9x/photo-2022-11-06-16-27-39.jpg" />
            </div>
            <div className="dossier_info">
               <p className="user_name">{nickname}</p>
               <p className="user_rang">{rank_name}</p>
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
                  className="exp_progress"
                  style={{
                     width: `${(gamer_exp / (gamer_exp + next_rang)) * 100}%`,
                  }}
               />
               <span>{`${gamer_exp}/${gamer_exp + next_rang}`}</span>
            </div>
         </div>
      </div>
   );
};
