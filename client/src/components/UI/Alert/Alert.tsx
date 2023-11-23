import React, { useContext, useState } from "react";
import { MediatorContext } from "../../../App";
import "./Alert.css";

export interface IAlert {
   message: string;
   style: "warning" | "error" | "disabled" | null;
   id?: string;
}

export const Alert: React.FC = () => {
   const [alert, setAlert] = useState<IAlert>({
      message: "",
      style: null,
      id: "",
   });

   const mediator = useContext(MediatorContext);
   const { WARNING } = mediator.getTriggerTypes();
   mediator.set(WARNING, (warning: IAlert) => {
      setAlert({ ...warning, style: warning.style ?? "error" });
   });
   return (
      <div className={alert.style ?? "disabled"} id={alert.id}>
         <span>{alert.message}</span>
      </div>
   );
};
