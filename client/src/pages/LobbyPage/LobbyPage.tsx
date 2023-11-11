import React, { useState } from "react"
import { Button } from "../../components"
import { automat, RPG, tank2, tank3 } from "../../assets/pngs"; 
import { General, FlagBearer } from "../../components/Lobby";
import Dossier from "../../components/Dossier/Dossier";
import {TPage} from "../../interfaces";
import "./LobbyPage.css";
import GamePage from "../GamePage/GamePage";

interface ILobbyPageProps {
    setPage: React.Dispatch<React.SetStateAction<TPage>>;
}

const LobbyPage: React.FC<ILobbyPageProps> = ({setPage}) => {
    const logoutHandler = () => {
        setPage("MainPage");
    }

    return (
            <div className="lobby_block">
                <div className="lobby_block_units">
                    <FlagBearer />
                    <General/>
                    <Button id="test_button_2tank" className="units_item" appearance="image" onClick={() => setPage("Tank")}>Двухместный танк<img src={tank2} alt="Tank_2"/> </Button>
                    <Button id="test_button_infantrymanRPG" className="units_item" appearance="image"  onClick={() => setPage("Infantry")}>Пехотинец с гранотомётом<img src={RPG} alt="RPG"/></Button>
                    <Button id="test_button_3tank" className="units_item" appearance="image" onClick={() => setPage("Tank")}>Трёхместный танк<img src={tank3} alt="Tank_3"/> </Button>
                    <Button id="test_button_infantrymanGun" className="units_item" appearance="image" onClick={() => setPage("Infantry")}>Пехотинец-автоматчик<img src={automat} alt="Automat"/></Button>
                </div>
                <div className="lobby_block_right">
                    <Dossier/>
                    <Button id="test-button-goToMenu" onClick={logoutHandler} appearance="primary" className="logout_button">Выйти из Бахмута</Button>
                </div>
            </div>
    )
}

export default LobbyPage;