import React from "react"
import { Button } from "../../components"
import { automat, RPG, tank2, tank3 } from "./images"; 
import { General, FlagBearer } from "../../components/Lobby";
import "./LobbyPage.css";
import DossierPage from "../DossierPage/DossierPage";

const LobbyPage: React.FC = () => {
    
    return(
            <div className="lobbi_block">
                <div className="left">
                    <FlagBearer/>
                    <Button className="RPG"appearance="image"  onClick={() => {}}>Пехотинец с гранотомётом<img src={RPG} alt="RPG" /></Button>
                    <Button className="tank2" appearance="image" onClick={() => {}}> Двухместный танк <img src={tank2} alt="Tank_2" /> </Button>
                </div>
                <div className="right">
                    <General/>
                    <Button className="automat" appearance="image" onClick={() => {}}> Пехотинец-автоматчик <img src={automat} alt="Automat" /></Button>
                    <Button className="tank3" appearance="image" onClick={() => {}}> Трёхместный танк <img src={tank3} alt="Tank_3" /> </Button>
                </div>
                <div className="dossier">
                    <DossierPage/>
                </div>
            </div>
    )
}

export default LobbyPage;