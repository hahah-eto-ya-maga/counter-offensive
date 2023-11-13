import React, { useContext, useState } from "react";
import { MediatorContext } from "../../App";
import { IError } from "../../modules/Server/types";
import {Logo} from "../../components";
import {
   LobbyPage,
   LoadingPage,
   MenuPage,
   MainPage,
   RegistrationPage,
   ErrorPage,
} from "../../pages";
import { TPage } from "../../interfaces";
import "./PageHandler.css";

const PageHandler: React.FC = () => {
   const [error, setError] = useState<IError>(null!);
   const [page, setPage] = useState<TPage>("Lobby");

   const mediator = useContext(MediatorContext);
   const { SERVER_ERROR } = mediator.getEventTypes();
   mediator.subscribe(SERVER_ERROR, (error: IError) => {
      setError(error);
      setPage("Error");
   });
   return (
      <div className="page_handler">
        {page === "Lobby" && (
        <div className="header">
            <Logo/>
        </div>
      )}
         <>
            {page === "Error" && <ErrorPage {...error} />}
            {page === "Loading" && <LoadingPage />}
            {page === "Lobby" && <LobbyPage setPage={setPage}/>}
            {page === "MainPage" && <MainPage setPage={setPage} />}
            {page === "Registration" && <RegistrationPage setPage={setPage} />}
         </>
      </div>
   );
};

export default PageHandler;
