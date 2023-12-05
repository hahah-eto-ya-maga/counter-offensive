import { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { MediatorContext, ServerContext } from "../../../App";
import { Button, Chat, FlagBearer, Dossier } from "../../../components";
import { automat, chatIcon, RPG } from "../../../assets/png";

import {
   lobbyContext,
   withLayout,
} from "../../../components/LobbyLayout/Layout";

import "./LobbyInfo.css";

enum EOpen {
   chat,
   info,
}

const Lobby: FC = () => {
   const [isOpen, setIsOpen] = useState<EOpen>(EOpen.info);
   const mediator = useContext(MediatorContext);
   const server = useContext(ServerContext);
   const lobby = useContext(lobbyContext);

   const navigate = useNavigate();

   const logoutHandler = async () => {
      const { LOGOUT } = mediator.getTriggerTypes();
      const res = await server.logout();
      res && mediator.get(LOGOUT);
   };

   const handleChat = () => {
      switch (isOpen) {
         case EOpen.chat: {
            return setIsOpen(EOpen.info);
         }
         case EOpen.info: {
            return setIsOpen(EOpen.chat);
         }
      }
   };

   return (
      <>
         <div className={cn("lobby_units_block", "lobby_other_units")}>
            <FlagBearer />
            <Button
               id="test_button_infantrymanRPG"
               className="units_item"
               appearance="image"
               onClick={() => {
                  navigate("/game", {
                     state: {
                        userRole: "RPG",
                     },
                  });
               }}
            >
               Пехотинец с гранотомётом
               <img src={RPG} alt="RPG" />
            </Button>
            <Button
               id="test_button_infantrymanGun"
               className="units_item"
               appearance="image"
               onClick={() => {
                  navigate("/game", {
                     state: {
                        userRole: "Automat",
                     },
                  });
               }}
            >
               Пехотинец-автоматчик
               <img src={automat} alt="Automat" />
            </Button>
         </div>
         <div className={cn("lobby_info")}>
            <button
               className="chat_block"
               id="test-button-openCloseCchat"
               onClick={handleChat}
            >
               <img src={chatIcon} alt="chat_icon" />
               <span className="chat_text">Чат</span>
            </button>
            {isOpen === EOpen.chat ? (
               <div className="lobby_chat_block">
                  <Chat chatType={"lobby"} />
               </div>
            ) : (
               <>
                  <div className="lobby_dossier_block">
                     <Dossier
                     />
                  </div>
                  <Button
                     id="test-button-goToMenu"
                     onClick={logoutHandler}
                     appearance="primary"
                     className="logout_button"
                  >
                     Выйти из Бахмута
                  </Button>
               </>
            )}
         </div>
      </>
   );
};

export const LobbyInfo = withLayout(Lobby);
