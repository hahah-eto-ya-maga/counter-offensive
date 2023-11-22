import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { IError } from "../../modules/Server/types";
import "./ErrorPage.css";

const ErrorPage: FC = () => {
   const navigate = useNavigate();
   const { state }: { state: { error: IError } | null } = useLocation();
   const error = state?.error ?? { code: 404, text: "Page Not Found" };

   return (
      <div className="error-page-wrapper">
         <div className="error-code-block">
            <div className="error-code">
               <span id="test-error-code">Error № {error.code}</span>
            </div>
            <div>
               <Button
                  appearance="primary"
                  id="test-error-back-button"
                  onClick={() => {
                     navigate("/", { replace: true });
                  }}
               >
                  Назад
               </Button>
            </div>
         </div>
         <div className="error-text">
            <span id="test-error-text">{error.text}</span>
         </div>
      </div>
   );
};

export default ErrorPage;
