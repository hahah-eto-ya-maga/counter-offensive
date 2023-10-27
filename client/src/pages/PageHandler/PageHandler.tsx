import React, { useState } from "react";
import { Button } from "../../components";
import LobbyPage from "../LobbyPage/LobbyPage";
import LoadingPage from "../LoadingPage/LoadingPage";
import DossierPage from "../DossierPage/DossierPage";

import "./PageHandler.css";
import MenuPage from "../MenuPage/MenuPage";
import MainPage from "../MainPage/MainPage";

export type TPage = "Lobby" | "Dossier" | "Loading" | "Menu" | "MainPage";

const PageHandler: React.FC = () => {
  const [page, setPage] = useState<TPage>("MainPage");
  return (
    <div className="page_handler">
      {page !== "Menu" && page !== "MainPage" && (
        <div className="header">
          <Button
            appearance="primary"
            active={page === "Lobby"}
            onClick={() => setPage("Lobby")}
          >
            Лобби
          </Button>
          <Button
            appearance="primary"
            active={page === "Dossier"}
            onClick={() => setPage("Dossier")}
          >
            Досье
          </Button>
          <Button appearance="primary" onClick={() => setPage("Menu")}>
            Меню
          </Button>
        </div>
      )}
      <>
        {page === "Dossier" && <DossierPage />}
        {page === "Loading" && <LoadingPage />}
        {page === "Lobby" && <LobbyPage />}
        {page === "Menu" && <MenuPage goToLobby={setPage} />}
        {page === "MainPage" && <MainPage goToLobby={setPage} />}
      </>
    </div>
  );
};

export default PageHandler;
