import React from "react";
import "./TankTwoLobbyPage.css"
import { logoImg, closeImg, tank2Img, tank3Img, generalImg } from "./svgLobbyTank"; 
import { Button } from "../../components"
import cn from "classnames";
const TankTwoLobbyPage: React.FC = ()=>{
    return(
        <div className="main">
            <div className="logo" id="logo">
                <img src={logoImg} className="img_logo"></img>
            </div>
            <div id="tank_lobby_Page" className="tank_lobby_page">
            <div className="menu_tank" id="menu_tank">
                <Button  appearance="image"  className="general_img" id="general_img" onClick={() => {}}> Генерал <img src={generalImg} alt="general" /></Button>
                <Button appearance="image" className="tank2_img" id="tank2_img" onClick={() => {}}> Двуместный танк <img src={tank2Img} alt="Tank_2" /></Button>
                <Button appearance="image" className="tank3_img" id="tank3_img"  onClick={() => {}}> Трёхместный танк <img src={tank3Img} alt="Tank_3" /> </Button>
            </div>
            <div className="window" id="window">
                <div id="title_window" className="title_window">Двухместный танк танк 2 занято мест - 1/2</div>
                <div id="close_img" className="close_img"  onClick={() => {}}> <img src={closeImg} alt="close_button" /></div>
                <button id="player_one" className="player_one">Наводчик</button>
                <button id="player_two" className="player_two">мехВод</button>
                <img className="img_window" id="img_window" src={tank2Img}></img>
            </div>
            </div>
        </div>
    );
}
export default TankTwoLobbyPage;