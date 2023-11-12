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
import { Button } from "../../components";
import { ServerWarnings, TPage } from "../../interfaces";
import "./PageHandler.css";

const PageHandler: React.FC = () => {
  const [error, setError] = useState<IError>(null!);
  const [page, setPage] = useState<TPage>("MainPage");

  const mediator = useContext(MediatorContext);
  const { SERVER_ERROR } = mediator.getEventTypes();
  mediator.subscribe(SERVER_ERROR, (error: IError) => {
    const exeptions: number[] = ServerWarnings.map((el) => el.code);
    if (exeptions.includes(error.code)) {
      const { WARNING } = mediator.getTriggerTypes();
      const warning = ServerWarnings.find((el) => el.code === error.code)?.text;
      mediator.get(WARNING, { message: warning, style: "error" });
      return;
    }
    setError(error);
    setPage("Error");
  });

  return (
    <div className="page_handler">
      {page !== "Menu" && page !== "MainPage" && (
        <div className="header">
          <Logo />
        </div>
      )}
      {page !== "Menu" &&
        page !== "MainPage" &&
        page !== "Registration" &&
        page !== "Error" && (
          <div className="header">
            <Button
              appearance="primary"
              id="test_hand_goToLobby_button"
              active={page === "Lobby"}
              onClick={() => setPage("Lobby")}
            >
              Лобби
            </Button>
            <Button
              appearance="primary"
              id="test_hand_goToMenu_button"
              onClick={() => setPage("Menu")}
            >
              Меню
            </Button>
          </div>
        )}
      <>
        {page === "Error" && <ErrorPage />}
        {page === "Loading" && <LoadingPage />}
        {page === "Lobby" && <LobbyPage />}
        {page === "Menu" && <MenuPage setPage={setPage} />}
        {page === "MainPage" && <MainPage setPage={setPage} />}
        {page === "Registration" && <RegistrationPage setPage={setPage} />}
      </>
    </div>
  );
};

export default PageHandler;
