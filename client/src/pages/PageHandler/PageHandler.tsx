import React, { useState } from "react";
import { Button } from "../../components";
import LobbiPage from "../LobbiPage/LobbiPage";
import LoadingPage from "../LoadingPage/LoadingPage";
import DossierPage from "../DossierPage/DossierPage";

import "./PageHandler.css";
import MenuPage from "../MenuPage/MenuPage";

export type TPage = "Lobby" | "Dossier" | "Loading" | "Menu";

const PageHandler: React.FC = () => {
  const [page, setPage] = useState<TPage>("Lobby");
  return (
    <div className="page_handler">
      {page !== "Menu" && (
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
        {page === "Lobby" && <LobbiPage />}
        {page === "Menu" && <MenuPage goToLobby={ setPage} />}
      </>
    </div>
  );
};

export default PageHandler;
