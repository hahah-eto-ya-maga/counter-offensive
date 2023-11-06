import { FC, useContext, useState } from "react";
import { MediatorContext } from "../../App";
import { IError } from "../../modules/Server/types";
import "./ErrorPage.css";

const ErrorPage: FC = () => {
   const [error, setError] = useState<IError>({ text: "Not Found", code: 404 });
   const mediator = useContext(MediatorContext);
   const { SERVER_ERROR } = mediator.getEventTypes();
   mediator.subscribe(SERVER_ERROR, (error: IError) => {
      setError(error);
   });
   return (
      <div className="error-page-wrapper">
         <div className="error_code">
            <span>Error № {error.code}</span>
         </div>
         <div className="error_text">
            <span>{error.text}</span>
         </div>
      </div>
   );
};

export default ErrorPage;
