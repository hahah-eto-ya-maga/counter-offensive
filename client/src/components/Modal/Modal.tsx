import { FC, useContext, useEffect, useState } from "react";
import cn from "classnames";
import { MediatorContext } from "../../App";
import "./Modal.css";

export const Modal: FC = () => {
   const [message, setMessage] = useState<string>("");

   const mediator = useContext(MediatorContext);
   const { ROLE_ERROR } = mediator.getTriggerTypes();

   useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      mediator.set(ROLE_ERROR, (message: string) => {
         setMessage(message);

         clearTimeout(timeoutId);

         timeoutId = setTimeout(() => {
            setMessage("");
         }, 4000);
      });

      return () => {
         clearTimeout(timeoutId);
      };
   }, []);
   return (
      <div
         className={cn("modal_window", {
            disabled: !message,
         })}
         onClick={() => setMessage("")}
      >
         <div className="modal_message">{message}</div>
      </div>
   );
};
