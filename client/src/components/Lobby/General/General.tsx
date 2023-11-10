import React, { useState } from "react";
import cn from "classnames";
import { Button } from "../../UI";
import { general } from "../../../assets/pngs";
import "./General.css";

const General: React.FC = () => {
   let [statusGeneral, setStatusGeneral] = useState(false);
   const changeStatusGeneral = () => {
      setStatusGeneral(true);
      // отправка статуса на сервер
   };

   return (
      <Button
         className="general"
         appearance="image"
         onClick={changeStatusGeneral}
      >
         Генерал {"("}
         <span
            className={cn("status", {
               free: !statusGeneral,
               selected: statusGeneral,
            })}
         >
            {statusGeneral ? "Занято" : "Свободно"}
         </span>
         {")"}
         <img src={general} alt="General" />
      </Button>
   );
};

export default General;
