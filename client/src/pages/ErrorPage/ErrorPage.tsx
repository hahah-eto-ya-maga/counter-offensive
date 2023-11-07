import { FC } from "react";
import { IError } from "../../modules/Server/types";
import "./ErrorPage.css";

const ErrorPage: FC<IError> = ({ code, text }) => {
   return (
      <div className="error-page-wrapper">
         <div className="error_code">
            <span id="test-error-code">Error № {code}</span>
         </div>
         <div className="error_text">
            <span id="test-error-text">{text}</span>
         </div>
      </div>
   );
};

export default ErrorPage;
