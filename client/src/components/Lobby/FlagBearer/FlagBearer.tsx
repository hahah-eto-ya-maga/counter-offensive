import React, { useState } from "react";
import cn from "classnames";
import { Button } from "../../UI";
import { flag } from "../../../assets/pngs";
import "./FlagBearer.css";

const FlagBearer: React.FC = () => {
   let [statusFlag, setStatusFlag] = useState(false);
   const changeStatusFlag = () => {
      setStatusFlag(true);

      // отправка статуса на сервер
   };

   return (
      <Button className="flag" appearance="image" onClick={changeStatusFlag}>
         Знаменосец {"("}
         <span
            className={cn("status", {
               free: !statusFlag,
               selected: statusFlag,
            })}
         >
            {statusFlag ? "Занято" : "Свободно"}
         </span>
         {")"}
         <img src={flag} alt="Flag" />
      </Button>
   );
};

export default FlagBearer;
