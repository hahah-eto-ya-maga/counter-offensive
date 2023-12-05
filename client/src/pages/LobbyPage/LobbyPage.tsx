<<<<<<< HEAD
import React, { useState } from "react"
import { Button } from "../../components"
import { automat, RPG, tank2, tank3 } from "../../assets/pngs"; 
=======
import { FC, useContext } from "react";
import { MediatorContext, ServerContext } from "../../App";
import { Button, Logo } from "../../components";
import { automat, RPG, tank2, tank3 } from "../../assets/pngs";
>>>>>>> 60a2dc80b0b1dac4a1766fe85067c58ddf415cf5
import { General, FlagBearer } from "../../components/Lobby";
import { Dossier } from "../../components";
import "./LobbyPage.css";
<<<<<<< HEAD
import TankThreeLobbyPage from "../TankThreeLobbyPage/TankThreeLobbyPage";
=======
import { useNavigate } from "react-router-dom";
>>>>>>> 60a2dc80b0b1dac4a1766fe85067c58ddf415cf5

const LobbyPage: FC = () => {
   const mediator = useContext(MediatorContext);
   const server = useContext(ServerContext);

<<<<<<< HEAD
const LobbyPage: React.FC<ILobbyPageProps> = ({setPage}) => {
    const logoutHandler = () => {
        setPage("MainPage");
    }
    const [page, setPageTank] = useState("");
    const tankLobby= () => {
        setPageTank("tank3");
        const grid = document.getElementById("lobby_block_units");
        if (grid!= null)
        { 
            grid.style.display  = 'block';
        }
        else
        { console.log('lobby_block_units - нету')};
    }
    return (
            <div className="lobby_block">
                <div className="lobby_block_units" id="lobby_block_units">
                    <FlagBearer />
                    {page != "tank3" && (<General/>)}
                    <Button id="test_button_2tank" className="units_item" appearance="image" onClick={() => {}}>Двухместный танк<img src={tank2} alt="Tank_2"/> </Button>
                    {page != "tank3" && (<Button id="test_button_infantrymanRPG" className="units_item" appearance="image"  onClick={() => {}}>Пехотинец с гранотомётом<img src={RPG} alt="RPG"/></Button>)}
                    <Button id="test_button_3tank" className="units_item" appearance="image"  onClick={tankLobby}>Трёхместный танк<img  src={tank3} alt="Tank_3"/> </Button>
                   {page != "tank3" && ( <Button id="test_button_infantrymanGun" className="units_item" appearance="image" onClick={()=>{}}>Пехотинец-автоматчик<img src={automat} alt="Automat"/></Button>)}
                </div>
                {page != "tank3" && ( <div className="lobby_block_right">
                    <Dossier/>
                    <Button id="test-button-goToMenu" onClick={logoutHandler} appearance="primary" className="logout_button">Выйти из Бахмута</Button>
                </div>)}
                <>
                {page === "tank3" && <TankThreeLobbyPage/> }
            </>
            </div>
            
    )
}
=======
   const navigate = useNavigate()

   const logoutHandler = async () => {
      const res = await server.logout();
      if (res) {
         const { TOKEN_UPDATE } = mediator.getTriggerTypes();
         mediator.get(TOKEN_UPDATE, null);
      }
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
                  onClick={() => {
                     navigate("/game", {
                        state: {
                           userRole: "Tank"
                        }
                     })
                  }}
               >
                  Двухместный танк
                  <img src={tank2} alt="Tank_2" />
               </Button>
               <Button
                  id="test_button_infantrymanRPG"
                  className="units_item"
                  appearance="image"
                  onClick={() => {
                     navigate("/game", {
                        state: {
                           userRole: "RPG"
                        }
                     })
                  }}
               >
                  Пехотинец с гранотомётом
                  <img src={RPG} alt="RPG" />
               </Button>
               <Button
                  id="test_button_3tank"
                  className="units_item"
                  appearance="image"
                  onClick={() => {
                     navigate("/game", {
                        state: {
                           userRole: "Tank"
                        }
                     })
                  }}
               >
                  Трёхместный танк
                  <img src={tank3} alt="Tank_3" />
               </Button>
               <Button
                  id="test_button_infantrymanGun"
                  className="units_item"
                  appearance="image"
                  onClick={() => {
                     navigate("/game", {
                        state: {
                           userRole: "Automat"
                        }
                     })
                  }}
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
>>>>>>> 60a2dc80b0b1dac4a1766fe85067c58ddf415cf5

export default LobbyPage;
