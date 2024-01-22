import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ServerContext } from "../../App";
import { Chat } from "../../components";
import GameCanvas from "./components/GameCanvas/GameCanvas";
import GameOverlay from "./components/GameOverlay/GameOverlay";
import GameTime from "./components/GameTime/GameTime";
import "./GamePage.css";

const GamePage: React.FC = () => {
    const chatInputRef = useRef<HTMLInputElement | null>(null);
    const server = useContext(ServerContext);
    const navigate = useNavigate();

    const leaveGameHandler = async () => {
        const res = await server.suicide();
        if (res) {
            navigate("/", { replace: true });
        }
    };
    return (
        <div className="game_page">
            <GameOverlay />
            <GameTime />
            <button
                id="test_leave_game_button"
                className="game_leave_button"
                onClick={leaveGameHandler}
            >
                Сбежать
            </button>
            <GameCanvas inputRef={chatInputRef} />
            <div className="game_chat_block">
                <Chat chatType="game" ref={chatInputRef} />
            </div>
        </div>
    );
};
export default GamePage;
