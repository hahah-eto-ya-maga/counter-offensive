import { Chat } from "../../components";
import GameCanvas from "./components/GameCanvas";
import "./GamePage.css"

const GamePage: React.FC = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const prop = width / height;

    return(
        <div className="game_page">
            <GameCanvas/>
            {/* <Chat chatType="game"/> */}
        </div>
       
    )    
}
export default GamePage;
