import React from "react"
import {Button} from "../../components"
import { General, FlagBearer } from "../../components/Lobby";
import Dossier from "../../components/Dossier/Dossier";
import { automat, RPG, tank2, tank3 } from "./images";
import "./LobbyPage.css";

const LobbyPage: React.FC = () => {
    const user = {
        login: "Vasya",
        gamesCount: 4,
        expCount: 32,
        rang: "Хомяк",
    };
    return (
            <div className="lobby_block">
                <div className="units">
                    <FlagBearer/>
                    <General/>
                    <Button className="RPG units_item" appearance="image"  onClick={() => {}}>Пехотинец с гранотомётом<img src={RPG} alt="RPG" /></Button>
                    <Button className="tank2 units_item" appearance="image" onClick={() => {}}> Двухместный танк <img src={tank2} alt="Tank_2" /> </Button>
                    <Button className="automat units_item" appearance="image" onClick={() => {}}> Пехотинец-автоматчик <img src={automat} alt="Automat" /></Button>
                    <Button className="tank3 units_item" appearance="image" onClick={() => {}}> Трёхместный танк <img src={tank3} alt="Tank_3" /> </Button>
                </div>
                <Dossier/>
            </div>
    )
}

export default LobbyPage;