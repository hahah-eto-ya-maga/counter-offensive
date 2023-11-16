import React, { useContext, useState } from "react";
import { MediatorContext } from "../../App";
import { IError } from "../../modules/Server/types";
import { Logo } from "../../components";
import {
  LobbyPage,
  LoadingPage,
  MenuPage,
  MainPage,
  RegistrationPage,
  ErrorPage,
} from "../../pages";
import { ServerWarnings, TPage } from "../../interfaces";
import "./PageHandler.css";

const PageHandler: React.FC = () => {
  const [page, setPage] = useState<TPage>("MainPage");

  const mediator = useContext(MediatorContext);
  const { SERVER_ERROR } = mediator.getEventTypes();
  const { WARNING, ERROR } = mediator.getTriggerTypes();
  mediator.subscribe(SERVER_ERROR, (error: IError) => {
    const exeptions: number[] = ServerWarnings.map((el) => el.code);
    if (exeptions.includes(error.code)) {
      const warning = ServerWarnings.find((el) => el.code === error.code)?.text;
      mediator.get(WARNING, { message: warning, style: "error" });
      return;
    }
    mediator.get(ERROR, error);
    setPage("Error");
  });

  return (
    <div className="page_handler">
      {page === "Lobby" && (
        <div className="header">
          <Logo />
        </div>
      )}
      <>
        <ErrorPage />
        {page === "Loading" && <LoadingPage />}
        {page === "Lobby" && <LobbyPage setPage={setPage} />}
        {page === "Menu" && <MenuPage setPage={setPage} />}
        {page === "MainPage" && <MainPage setPage={setPage} />}
        {page === "Registration" && <RegistrationPage setPage={setPage} />}
      </>
    </div>
  );
};

export default PageHandler;
