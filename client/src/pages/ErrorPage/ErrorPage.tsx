import { FC, useContext, useState } from "react";
import { IError } from "../../modules/Server/types";
import { MediatorContext } from "../../App";
import cn from "classnames";
import "./ErrorPage.css";

interface IErrorPage extends IError {
  isShow: boolean;
}

const ErrorPage: FC = () => {
  const [error, setError] = useState<IErrorPage>({
    code: 404,
    text: "Page Not Found",
    isShow: false,
  });

  const mediator = useContext(MediatorContext);
  const { ERROR } = mediator.getTriggerTypes();
  mediator.set(ERROR, (error: IError) => {
    setError({ ...error, isShow: true });
  });

  return (
    <>
      {error.isShow && (
        <div className={cn("error-page-wrapper", {})}>
          <div className="error_code">
            <span id="test-error-code">Error № {error.code}</span>
          </div>
          <div className="error_text">
            <span id="test-error-text">{error.text}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorPage;
