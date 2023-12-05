import { FC, useContext } from "react";
import cn from "classnames";
import { Button } from "../../UI";
import { general } from "../../../assets/png";
import { ServerContext } from "../../../App";
import { lobbyContext } from "../../LobbyLayout/Layout";
import { EGamerRole } from "../../../modules/Server/interfaces";

import "./General.css";

const General: FC = () => {
   const server = useContext(ServerContext);
   const lobby = useContext(lobbyContext);
   const setGeneralHandler = async () => {
      const res = await server.setGamerRole(EGamerRole.general);
   };

   return (
      <Button
         id="test_button_general"
         className={cn("general units_item", {
            /* free: lobby.lobby.general,
            selected: lobby.lobby.general, */
         })}
         appearance="image"
         onClick={setGeneralHandler}
      >
         Генерал
         <img src={general} alt="General" />
      </Button>
   );
};

export default General;
