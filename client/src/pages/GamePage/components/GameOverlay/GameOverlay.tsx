import { FC, HTMLAttributes, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { MediatorContext } from "../../../../App";
import "./GameOverlay.css";

export type TGameStatus = "victory" | "defeat" | null;

interface Props extends HTMLAttributes<HTMLDivElement> {}

const GameOverlay: FC<Props> = ({ className, ...props }) => {
    const mediator = useContext(MediatorContext);
    const navigate = useNavigate();

    const [gameStatus, setGameStatus] = useState<TGameStatus>(null);

    useEffect(() => {
        const { THROW_TO_LOBBY } = mediator.getTriggerTypes();
        mediator.set(THROW_TO_LOBBY, (status: TGameStatus) => {
            setGameStatus(status);
            setTimeout(() => {
                setGameStatus(null);
                navigate("/");
            }, 3000);
        });
    });
    return (
        <div
            className={cn(className, "game_overlay", {
                game_overlay_visiable: gameStatus,
            })}
            {...props}
        >
            <h1
                className={cn("game_overlay_text", {
                    game_victory: gameStatus === "victory",
                })}
            >
                {gameStatus === "victory" ? "Победа" : "Подбит"}
            </h1>
        </div>
    );
};

export default GameOverlay;
