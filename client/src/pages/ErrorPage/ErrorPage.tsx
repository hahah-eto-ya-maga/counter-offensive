import { FC } from "react";
import { IError } from "../../modules/Server/types";
import { Button } from "../../components";
import "./ErrorPage.css";

const ErrorPage: FC<IError> = ({ code, text }) => {
   return (
      <div className="error-page-wrapper">
         <div className="error-code-block">
            <div className="error-code">
               <span id="test-error-code">Error № {code}</span>
            </div>
            <div>

            <Button appearance="primary" id="test-error-back-button">Назад</Button>
            </div>
         </div>
         <div className="error-text">
            <span id="test-error-text">{text}</span>
         </div>
      </div>
   );
};

export default ErrorPage;
