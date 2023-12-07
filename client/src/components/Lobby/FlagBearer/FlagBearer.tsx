import React, { useState } from "react";
import cn from "classnames";
import { Button } from "../../UI";
import { flag } from "../../../assets/png";
import "./FlagBearer.css";
import { useNavigate } from "react-router-dom";

const FlagBearer: React.FC = () => {
   let [statusFlag, setStatusFlag] = useState(false);
   const navigate = useNavigate()
   const changeStatusFlag = () => {
      setStatusFlag(true);
      navigate("/game", {
         state: {
            userRole: "Flag"
         }
      })
      // отправка статуса на сервер
   };

  return (
    <Button
      id="test_button_standartBearer"
      className={cn("flag units_item", {
        free: !statusFlag,
        selected: statusFlag,
      })}
      appearance="image"
      onClick={changeStatusFlag}
    >
      Знаменосец
      <img src={flag} alt="Flag" />
    </Button>
  );
};

export default FlagBearer;
