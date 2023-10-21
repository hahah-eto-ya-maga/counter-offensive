import React from "react";
import "./Info.css";
import { Button } from "../../UI";

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
      <>
         <div>
            <div className="dossier_image">PHOTO</div>
         </div>
         <div className="dossier_info">
            <div>
               <p>Логин - {login}</p>
               <p>Количество игр - {gamesCount}</p>
               <p>Количество опыта - {expCount}</p>
               <p>Звание - {rang}</p>
            </div>
         </div>
         <div>
            <div className="dossier_showcase">
               <div>
                  <Button
                     appearance="primary"
                     className="dossier_button"
                     onClick={() => changePage("shop")}
                  >
                     Витрина достижений
                  </Button>
               </div>
               <div className="achivment">
                  <span>“Тут какое-то выбранное пользователем достижение”</span>
               </div>
            </div>
         </div>
      </>
   );
};

export default Info;
