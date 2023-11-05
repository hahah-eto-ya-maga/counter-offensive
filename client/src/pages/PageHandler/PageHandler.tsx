import React, { useState } from "react";
import {
  LobbyPage,
  LoadingPage,
  DossierPage,
  MenuPage,
  MainPage,
  RegistrationPage,
} from "../../pages";
import { Button } from "../../components";
import { TPage } from "../../interfaces";

import "./PageHandler.css";

const PageHandler: React.FC = () => {
  const [page, setPage] = useState<TPage>("MainPage");
  return (
    <div className="page_handler">
      {page !== "Menu" && page !== "MainPage" && page !== "Registration" && (
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
            id="test_hand_goToDossier_button"
            active={page === "Dossier"}
            onClick={() => setPage("Dossier")}
          >
            Досье
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
        {page === "Dossier" && <DossierPage />}
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
