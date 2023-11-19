import { FC, useContext, useState } from "react";
import { IError } from "../../modules/Server/types";
import { Button } from "../../components";
import { MediatorContext } from "../../App";
import cn from "classnames";
import "./ErrorPage.css";
import { useNavigate } from "react-router-dom";

const ErrorPage: FC = () => {
  const [error, setError] = useState<IError>({
    code: 404,
    text: "Page Not Found",
  });

  const navigate = useNavigate();

  const mediator = useContext(MediatorContext);
  const { ERROR } = mediator.getTriggerTypes();
  mediator.set(ERROR, (error: IError) => {
    setError({ ...error });
  });

  return (
    <div className={cn("error-page-wrapper", {})}>
      <div className="error-code-block">
        <div className="error-code">
          <span id="test-error-code">Error № {error.code}</span>
        </div>
        <div>
          <Button
            appearance="primary"
            id="test-error-back-button"
            onClick={() => navigate(-1)}
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
