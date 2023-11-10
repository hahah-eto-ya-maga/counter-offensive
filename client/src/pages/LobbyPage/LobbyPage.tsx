import React from "react"
import { Button } from "../../components"
import { automat, RPG, tank2, tank3 } from "../../assets/pngs"; 
import { General, FlagBearer } from "../../components/Lobby";
import Dossier from "../../components/Dossier/Dossier";
import "./LobbyPage.css";

const LobbyPage: React.FC = () => {
    const logoutHandler = () => {

    }

    return (
            <div className="lobby_block">
                <div className="lobby_block_units">
                    <FlagBearer/>
                    <General/>
                    <Button className="tank2 units_item" appearance="image" onClick={() => {}}>Двухместный танк<img src={tank2} alt="Tank_2"/> </Button>
                    <Button className="RPG units_item" appearance="image"  onClick={() => {}}>Пехотинец с гранотомётом<img src={RPG} alt="RPG"/></Button>
                    <Button className="tank3 units_item" appearance="image" onClick={() => {}}>Трёхместный танк<img src={tank3} alt="Tank_3"/> </Button>
                    <Button className="automat units_item" appearance="image" onClick={() => {}}>Пехотинец-автоматчик<img src={automat} alt="Automat"/></Button>
                </div>
                <div className="lobby_block_right">
                    <Dossier/>
                    <Button appearance="primary" className="logout_button">Выйти из Бахмута</Button>
                </div>
            </div>
    )
}

export default LobbyPage;