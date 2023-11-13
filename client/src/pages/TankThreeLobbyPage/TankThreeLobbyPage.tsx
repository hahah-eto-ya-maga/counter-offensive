import React from "react";
import "./TankThreeLobbyPage.css"
import { closeImg, tank2Img, tank3Img, generalImg, ellepsGreen, ellepsRed } from "./svgLobbyTank"; 
import { Button, Logo } from "../../components"
import cn from "classnames";
const TankThreeLobbyPage: React.FC = ()=>{
    return(
        <div>
            {/* <div id="tank_lobby_Page" className="tank_lobby_page">
            <div className="menu_tank" id="menu_tank">
                <Button  appearance="image"  className="test_button_general_tank_lobby" id="test_button_general_tank_lobby" onClick={() => {}}> Генерал <img src={generalImg} alt="general" /></Button>
                <Button appearance="image" className="test_button_tank_2" id="test_button_tank_2" onClick={() => {}}> Трёхместный танк <img src={tank3Img} alt="Tank_2" /></Button>
                <Button appearance="image" className="test_button_tank_3" id="test_button_tank_3"  onClick={() => {}}> Двуместный танк <img src={tank2Img} alt="Tank_3" /> </Button>
            </div> */}
            <div className="window" id="window">
                <div id="title_window" className="title_window">Трёхместныйместный танк 3 занято мест - 0/3</div>
                <button className="test_button_cross" id="test_button_cross"><img src={closeImg} alt="test_button_cross" /></button>
                <button className="test_button_shooter_3" id="test_button_shooter_3" onClick={() => {}}> МехВод</button>
                <button className="test_button_tank_driver_3" id="test_button_tank_driver_3"  onClick={() => {}}> Наводчик</button>
                <button className="test_button_tank_commander" id="test_button_tank_commander" onClick={() => {}}> Командир </button>
                <img className="img_window" id="img_window" src={tank3Img}></img>
            </div>
            </div>
        // </div>
    );
}
export default TankThreeLobbyPage;