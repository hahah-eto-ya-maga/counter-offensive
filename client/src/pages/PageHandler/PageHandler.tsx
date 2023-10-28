import React, { useState } from "react";
import {Button, Logo} from "../../components";
import LobbyPage from "../LobbyPage/LobbyPage";
import LoadingPage from "../LoadingPage/LoadingPage";
import Dossier from "../../components/Dossier/Dossier";
import MenuPage from "../MenuPage/MenuPage";
import MainPage from "../MainPage/MainPage";
import { TPage } from '../../interfaces';

import "./PageHandler.css";


const PageHandler: React.FC = () => {
  const [page, setPage] = useState<TPage>("MainPage");
  return (
    <div className="page_handler">
      {page !== "Menu" && page !== "MainPage" && (
        <div className="header">
        </div>
      )}
      <>
        {page === "Loading" && <LoadingPage />}
        {page === "Lobby" && <LobbyPage />}
        {page === "Menu" && <MenuPage setPage={setPage} />}
        {page === "MainPage" && <MainPage setPage={setPage} />}
      </>
    </div>
  );
};

export default PageHandler;
