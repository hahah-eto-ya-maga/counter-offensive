import { FC, useContext, useState } from "react";
import { IError } from "../../modules/Server/types";
import "./ErrorPage.css";
import { MediatorContext } from "../../App";

const ErrorPage: FC = () => {
  const [error, setError] = useState<IError>({
    code: 404,
    text: "Page Not Found",
  });

  const mediator = useContext(MediatorContext);
  const { ERROR } = mediator.getTriggerTypes();
  mediator.set(ERROR, (error: IError) => {
    setError(error);
  });

  return (
    <div className="error-page-wrapper">
      <div className="error_code">
        <span id="test-error-code">Error № {error.code}</span>
      </div>
      <div className="error_text">
        <span id="test-error-text">{error.text}</span>
      </div>
    </div>
  );
};

export default ErrorPage;
