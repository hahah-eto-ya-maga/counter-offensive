import React from "react"
import { Button } from "../../components"
import { automat, RPG, tank2, tank3 } from "../../assets/pngs"; 
import { General, FlagBearer } from "../../components/Lobby";
import Dossier from "../../components/Dossier/Dossier";
import {TPage} from "../../interfaces";
import "./LobbyPage.css";

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
                    <FlagBearer/>
                    <General/>
                    <Button className="units_item" appearance="image" onClick={() => {}}>Двухместный танк<img src={tank2} alt="Tank_2"/> </Button>
                    <Button className="units_item" appearance="image"  onClick={() => {}}>Пехотинец с гранотомётом<img src={RPG} alt="RPG"/></Button>
                    <Button className="units_item" appearance="image" onClick={() => {}}>Трёхместный танк<img src={tank3} alt="Tank_3"/> </Button>
                    <Button className="units_item" appearance="image" onClick={() => {}}>Пехотинец-автоматчик<img src={automat} alt="Automat"/></Button>
                </div>
                <div className="lobby_block_right">
                    <Dossier/>
                    <Button onClick={logoutHandler} appearance="primary" className="logout_button">Выйти из Бахмута</Button>
                </div>
            </div>
    )
}

export default LobbyPage;