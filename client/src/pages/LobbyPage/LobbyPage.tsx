import React, { useState } from "react"
import { Button } from "../../components"
import { automat, RPG, tank2, tank3 } from "../../assets/pngs"; 
import { General, FlagBearer } from "../../components/Lobby";
import "./LobbyPage.css";
import { TPage } from "../../interfaces";
import GamePage from "../GamePage/GamePage";

const LobbyPage: React.FC = () => {
    
    const [page, setPage] = useState<TPage>();

    return(
        <div className="lobbi">
            {page !== 'Tank' && 
            page !== 'Infantry' && (
            <div className="lobbi_block">
                <div className="left">
                    <FlagBearer/>
                    <Button className="RPG"appearance="image"  onClick={() => setPage("Infantry")}>Пехотинец с гранотомётом<img src={RPG} alt="RPG" /></Button>
                    <Button className="tank2" appearance="image" onClick={() =>  setPage("Tank")}> Двухместный танк <img src={tank2} alt="Tank_2" /> </Button>
                </div>
                <div className="right">
                    <General/>
                    <Button className="automat" appearance="image" onClick={() =>  setPage("Infantry")}> Пехотинец-автоматчик <img src={automat} alt="Automat" /></Button>
                    <Button className="tank3" appearance="image" onClick={() =>  setPage("Tank")}> Трёхместный танк <img src={tank3} alt="Tank_3" /> </Button>
                </div>
            </div>
            )}
            <>
                {page === "Tank" && <GamePage unit = {page}/>}
                {page === "Infantry" && <GamePage unit = {page}/>}
            </>
    
            </div>
    )
}

export default LobbyPage;