import React, { useContext } from "react";
import { MediatorContext } from "../../App";
import { IError } from "../../modules/Server/types";
import { ServerWarnings } from "../../interfaces";
import "./PageHandler.css";

const PageHandler: React.FC = () => {
  const mediator = useContext(MediatorContext);
  const { SERVER_ERROR } = mediator.getEventTypes();
  const { WARNING, ERROR } = mediator.getTriggerTypes();
  mediator.subscribe(SERVER_ERROR, (error: IError & { id?: string }) => {
    const exeptions: number[] = ServerWarnings.map((el) => el.code);
    if (exeptions.includes(error.code)) {
      const warning = ServerWarnings.find((el) => el.code === error.code);
      if (warning) {
        mediator.get(WARNING, {
          message: warning.text,
          id: warning.id,
          style: "error",
        });
        return;
      }
    }
    mediator.get(ERROR, error);
  });

  return <></>;
};

export default PageHandler;
