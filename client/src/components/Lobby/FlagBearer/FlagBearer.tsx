import React, { useState } from "react";
import cn from "classnames";
import { Button } from "../../UI";
import { flag } from "../../../pages/LobbyPage/images";
import "./FlagBearer.css";

const FlagBearer: React.FC = () => {
   let [statusFlag, setStatusFlag] = useState(false);
   const changeStatusFlag = () => {
      setStatusFlag(true);

      // отправка статуса на сервер
   };

   return (

      <Button
          className={cn("flag units_item", {
              free: !statusFlag,
              selected: statusFlag,
          })}
              appearance="image"
              onClick={changeStatusFlag}>
         Знаменосец
         <img src={flag} alt="Flag" />
      </Button>
   );
};

export default FlagBearer;
