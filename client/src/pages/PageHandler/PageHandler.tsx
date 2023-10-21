import React, { useState } from "react";
import { Button } from "../../components";
import LobbiPage from "../LobbiPage/LobbiPage";
import LoadingPage from "../LoadingPage/LoadingPage";
import DossierPage from "../DossierPage/DossierPage";

import "./PageHandler.css";

type TPage = "Lobbi" | "Dossier" | "Loading" | "Menu";

const PageHandler: React.FC = () => {
   const [page, setPage] = useState<TPage>("Lobbi");
   return (
      <div className="page_handler">
         <div className="header">
            <Button
               appearance="primary"
               active={page === "Lobbi"}
               onClick={() => setPage("Lobbi")}
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
            <Button
               appearance="primary"
               active={page === "Menu"}
               onClick={() => setPage("Menu")}
            >
               Меню
            </Button>
         </div>
         <>
            {page === "Dossier" && <DossierPage />}
            {page === "Loading" && <LoadingPage />}
            {page === "Lobbi" && <LobbiPage />}
            {page === "Menu"}
         </>
      </div>
   );
};

export default PageHandler;
