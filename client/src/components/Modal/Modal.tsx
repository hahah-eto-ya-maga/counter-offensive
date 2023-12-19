import { FC, useContext, useEffect, useState } from "react";
import cn from "classnames";
import { MediatorContext } from "../../App";
import "./Modal.css";

interface MoodalError {
   id: string;
   message: string;
}

export const Modal: FC = () => {
   const [message, setMessage] = useState<MoodalError>({ message: "", id: "" });

   const mediator = useContext(MediatorContext);
   const { ROLE_ERROR } = mediator.getTriggerTypes();

   useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      mediator.set(ROLE_ERROR, (newMessaage: MoodalError) => {
         setMessage(newMessaage);

         clearTimeout(timeoutId);

         timeoutId = setTimeout(() => {
            clearMessage();
         }, 4000);
      });

      return () => {
         clearMessage();
      };
   }, []);

   const clearMessage = () => {
      setMessage({ message: "", id: "" });
   };
   return (
      <div
         className={cn("modal_window", {
            disabled: !message.message,
         })}
         onClick={clearMessage}
      >
         <div className="modal_message" id={message.id}>
            {message.message}
         </div>
      </div>
   );
};
