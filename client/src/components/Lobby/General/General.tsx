import React, { useState } from "react";
import cn from "classnames";
import { Button } from "../../UI";
import { general } from "../../../assets/png";
import "./General.css";

const General: React.FC = () => {
  const [statusGeneral, setStatusGeneral] = useState(false);
  const changeStatusGeneral = () => {
    setStatusGeneral(true);
    // отправка статуса на сервер
  };

  return (
    <Button
      id="test_button_general"
      className={cn("general units_item", {
        free: !statusGeneral,
        selected: statusGeneral,
      })}
      appearance="image"
      onClick={changeStatusGeneral}
    >
      Генерал
      <img src={general} alt="General" />
    </Button>
  );
};

export default General;
