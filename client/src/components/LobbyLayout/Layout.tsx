import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cn from "classnames";
import { MediatorContext, ServerContext } from "../../App";
import { requestDelay } from "../../config";
import { useSetRoleHandler } from "../../hooks/useSetRoleHandler";
import {
    EGamerRole,
    EHash,
    ETank,
    ILobby,
} from "../../modules/Server/interfaces";
import { Button, Logo } from "..";
import { tank2, tank3, general } from "./assets";

import "./Layout.css";

export const withLayout = (
    Component: FunctionComponent<{ lobby: ILobby | null }>
) => {
    return (): JSX.Element => {
        const [lobby, setLobby] = useState<ILobby>({
            userInfo: null,
            bannerman: true,
            general: true,
            is_alive: null,
            tanks: {
                heavyTank: [],
                middleTank: [],
            },
        });

        const server = useContext(ServerContext);
        const mediator = useContext(MediatorContext);
        const setRoleHandler = useSetRoleHandler();
        const navigate = useNavigate();
        const location = useLocation();

        const { THROW_TO_GAME } = mediator.getTriggerTypes();
        const path = location.pathname.split("/")[1];

        useEffect(() => {
            const interval = setInterval(async () => {
                const res = await server.getLobby();
                if (res && res !== true) {
                    if (res.lobby.is_alive) {
                        if (server.STORE.user) {
                            server.STORE.user.unit = res.lobby.is_alive;
                            return mediator.get(THROW_TO_GAME);
                        }
                    }
                    if (res.lobby.userInfo && server.STORE.user) {
                        const { gamer_exp, next_rang, rank_name } =
                            res.lobby.userInfo;
                        server.STORE.user = {
                            ...server.STORE.user,
                            gamer_exp,
                            next_rang,
                            rank_name,
                        };
                    }
                    server.STORE.setHash(EHash.lobby, res.lobbyHash);
                    setLobby(res.lobby);
                }
            }, requestDelay.lobby);
            return () => {
                server.STORE.setHash(EHash.lobby, null);
                clearInterval(interval);
            };
        }, []);

        const onClickTankLobbyHandler = (switchTo: ETank): void => {
            const replace: boolean =
                path === "heavy_tanks" || path === "middle_tanks";

            switch (switchTo) {
                case ETank.heavy: {
                    return navigate("/heavy_tanks", { replace });
                }
                case ETank.middle: {
                    return navigate("/middle_tanks", { replace });
                }
            }
        };

        return (
            <div className="lobby_wrapper">
                <Logo />
                <div className="lobby_block">
                    <div
                        className={cn("lobby_units_block", "lobby_main_units")}
                    >
                        <Button
                            id="test_button_general"
                            className={cn("general units_item", {
                                selected_role: !lobby.general,
                            })}
                            appearance="image"
                            onClick={() => setRoleHandler(EGamerRole.general)}
                        >
                            Генерал
                            <img src={general} alt="General" />
                        </Button>
                        <Button
                            id="test_button_2tank"
                            className={cn("units_item", {
                                tank_selected: path === "middle_tanks",
                            })}
                            appearance="image"
                            onClick={() =>
                                onClickTankLobbyHandler(ETank.middle)
                            }
                        >
                            Двухместный танк
                            <img src={tank2} alt="Tank_2" />
                        </Button>
                        <Button
                            id="test_button_3tank"
                            className={cn("units_item", {
                                tank_selected: path === "heavy_tanks",
                            })}
                            appearance="image"
                            onClick={() => onClickTankLobbyHandler(ETank.heavy)}
                        >
                            Трёхместный танк
                            <img src={tank3} alt="Tank_3" />
                        </Button>
                    </div>
                    <Component lobby={lobby} />
                </div>
            </div>
        );
    };
};
