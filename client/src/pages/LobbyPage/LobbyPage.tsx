import { FC, useContext } from "react";
import { Button, Logo } from "../../components";
import { automat, RPG, tank2, tank3 } from "../../assets/pngs";
import { General, FlagBearer } from "../../components/Lobby";
import { Dossier } from "../../components";
import "./LobbyPage.css";
import { MediatorContext } from "../../App";

const LobbyPage: FC = () => {
   const mediator = useContext(MediatorContext);

   const logoutHandler = () => {
      const { TOKEN_UPDATE } = mediator.getTriggerTypes();
      mediator.get(TOKEN_UPDATE, null);
   };

   return (
      <div className="lobby_wrapper">
         <Logo />
         <div className="lobby_block">
            <div className="lobby_block_units">
               <FlagBearer />
               <General />
               <Button
                  id="test_button_2tank"
                  className="units_item"
                  appearance="image"
                  onClick={() => {}}
               >
                  Двухместный танк
                  <img src={tank2} alt="Tank_2" />
               </Button>
               <Button
                  id="test_button_infantrymanRPG"
                  className="units_item"
                  appearance="image"
                  onClick={() => {}}
               >
                  Пехотинец с гранотомётом
                  <img src={RPG} alt="RPG" />
               </Button>
               <Button
                  id="test_button_3tank"
                  className="units_item"
                  appearance="image"
                  onClick={() => {}}
               >
                  Трёхместный танк
                  <img src={tank3} alt="Tank_3" />
               </Button>
               <Button
                  id="test_button_infantrymanGun"
                  className="units_item"
                  appearance="image"
                  onClick={() => {}}
               >
                  Пехотинец-автоматчик
                  <img src={automat} alt="Automat" />
               </Button>
            </div>
            <div className="lobby_block_right">
               <Dossier />
               <Button
                  id="test-button-goToMenu"
                  onClick={logoutHandler}
                  appearance="primary"
                  className="logout_button"
               >
                  Выйти из Бахмута
               </Button>
            </div>
         </div>
      </div>
   );
};

export default LobbyPage;
