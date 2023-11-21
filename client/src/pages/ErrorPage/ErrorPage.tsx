import { FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { ServerContext } from "../../App";
import "./ErrorPage.css";

const ErrorPage: FC = () => {
   const server = useContext(ServerContext);
   const navigate = useNavigate();
   const { error } = server;

   return (
      <div className="error-page-wrapper">
         <div className="error-code-block">
            <div className="error-code">
               <span id="test-error-code">
                  Error № {error ? error.code : 404}
               </span>
            </div>
            <div>
               <Button
                  appearance="primary"
                  id="test-error-back-button"
                  onClick={() => {
                     server.error = null;
                     navigate(-1);
                  }}
               >
                  Назад
               </Button>
            </div>
         </div>
         <div className="error-text">
            <span id="test-error-text">
               {error ? error.text : "Page Not Found"}
            </span>
         </div>
      </div>
   );
};

export default ErrorPage;
