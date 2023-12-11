import { FC, useContext, useState } from "react";
import cn from "classnames";
import { useSetRoleHandler } from "../../../hooks/useSetRoleHandler";
import { MediatorContext, ServerContext } from "../../../App";
import { withLayout } from "../../../components/LobbyLayout/Layout";
import { EGamerRole, ILobby } from "../../../modules/Server/interfaces";
import { Button, Chat, Dossier } from "../../../components";
import { automat, chatIcon, RPG, flag } from "../../../assets/png";

import "./LobbyInfo.css";

enum EOpen {
   chat,
   info,
}

const LobbyInfo: FC<{ lobby: ILobby | null }> = ({ lobby }) => {
   const [isOpen, setIsOpen] = useState<EOpen>(EOpen.info);
   const mediator = useContext(MediatorContext);
   const server = useContext(ServerContext);
   const setRoleHandler = useSetRoleHandler();

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
            <Button
               id="test_button_standartBearer"
               className={cn("units_item", "flag", {
                  selected_role: !lobby?.bannerman,
               })}
               appearance="image"
               onClick={() => setRoleHandler(EGamerRole.bannerman)}
            >
               Знаменосец
               <img src={flag} alt="Flag" />
            </Button>
            <Button
               id="test_button_infantrymanRPG"
               className="units_item"
               appearance="image"
               onClick={() => setRoleHandler(EGamerRole.infantryRPG)}
            >
               Пехотинец с гранотомётом
               <img src={RPG} alt="RPG" />
            </Button>
            <Button
               id="test_button_infantrymanGun"
               className="units_item"
               appearance="image"
               onClick={() => setRoleHandler(EGamerRole.infantry)}
            >
               Пехотинец-автоматчик
               <img src={automat} alt="Automat" />
            </Button>
         </div>
         <div className={cn("lobby_info")}>
            <button
               className="chat_block"
               id="test-button-openCloseChat"
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
                     <Dossier />
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

export default withLayout(LobbyInfo);
