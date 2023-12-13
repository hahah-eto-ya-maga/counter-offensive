import { useRef } from "react";
import { Chat } from "../../components";
import GameCanvas from "../../modules/Graph/GameCanvas";
import "./GamePage.css";

const GamePage: React.FC = () => {
   const chatInputRef = useRef<HTMLInputElement | null>(null);
   return (
      <div className="game_page">
         <Chat chatType="game" ref={chatInputRef} />
         <GameCanvas inputRef={chatInputRef} />
      </div>
   );
};
export default GamePage;
