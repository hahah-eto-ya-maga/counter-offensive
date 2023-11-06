import React, { useState } from "react";
import { Button } from "../../components";
import LobbyPage from "../LobbyPage/LobbyPage";
import LoadingPage from "../LoadingPage/LoadingPage";
import DossierPage from "../DossierPage/DossierPage";
import MenuPage from "../MenuPage/MenuPage";
import MainPage from "../MainPage/MainPage";
import ErrorPage from "../ErrorPage/ErrorPage";
import { TPage } from "../../interfaces";

import "./PageHandler.css";

const PageHandler: React.FC = () => {
   const [page, setPage] = useState<TPage>("MainPage");
   return (
      <div className="page_handler">
         {page !== "Menu" && page !== "MainPage" && page !== "Error" && (
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
            {page === 'Error' && <ErrorPage/>}
            {page === "Dossier" && <DossierPage />}
            {page === "Loading" && <LoadingPage />}
            {page === "Lobby" && <LobbyPage />}
            {page === "Menu" && <MenuPage setPage={setPage} />}
            {page === "MainPage" && <MainPage setPage={setPage} />}
         </>
      </div>
   );
};

export default PageHandler;
