import React from "react";
import { Button } from "../../UI";
import "./Info.css";

interface IUserProps {
   login: string;
   gamesCount: number;
   expCount: number;
   rang: string;
   changePage: React.Dispatch<React.SetStateAction<"info" | "shop">>;
}

const Info: React.FC<IUserProps> = ({
   login,
   expCount,
   gamesCount,
   rang,
   changePage,
}) => {
   return (
      <div className="info">
         <div className="dossier_user">
            <div>
               <div className="dossier_image">
                  <img src="https://i.ibb.co/BggNK9x/photo-2022-11-06-16-27-39.jpg" alt=""/>
               </div>
            </div>
            <Button
                id="test_button_showcase"
                appearance="primary"
                className="achievements_button"
                onClick={() => changePage("shop")}
            >
               Витрина достижений
            </Button>
         </div>

         <div className="dossier_info">
            <div>
               <p>Никнейм - {login}</p>
               <p>Количество игр - {gamesCount}</p>
               <p>Количество опыта - {expCount}</p>
               <p>Звание - {rang}</p>
            </div>
         </div>
      </div>
   );
};

export default Info;
