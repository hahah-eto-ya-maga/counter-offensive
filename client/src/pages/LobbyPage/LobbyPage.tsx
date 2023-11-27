import { FC, useContext, useState } from "react";
import cn from 'classnames';
import { MediatorContext, ServerContext } from "../../App";
import { Button, Chat, Logo } from "../../components";
import { automat, chatIcon, RPG, tank2, tank3 } from "../../assets/png";
import { General, FlagBearer } from "../../components/Lobby";
import { Dossier } from "../../components";
import "./LobbyPage.css";
import { useNavigate } from "react-router-dom";

const LobbyPage: FC = () => {
  const mediator = useContext(MediatorContext);
  const server = useContext(ServerContext);

  const navigate = useNavigate();

  const logoutHandler = async () => {
    const res = await server.logout();
    if (res) {
      const { TOKEN_UPDATE } = mediator.getTriggerTypes();
      mediator.get(TOKEN_UPDATE, null);
    }
  };

  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const handleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="lobby_wrapper">
      <Logo />
      <div className="lobby_block">
        <div className="lobby_block_units">
          <General />
          <FlagBearer />
          <Button
            id="test_button_2tank"
            className="units_item"
            appearance="image"
            onClick={() => {
              navigate("/game", {
                state: {
                  userRole: "Tank",
                },
              });
            }}
          >
            Двухместный танк
            <img src={tank2} alt="Tank_2" />
          </Button>
          <Button
            id="test_button_infantrymanRPG"
            className="units_item"
            appearance="image"
            onClick={() => {
              navigate("/game", {
                state: {
                  userRole: "RPG",
                },
              });
            }}
          >
            Пехотинец с гранотомётом
            <img src={RPG} alt="RPG" />
          </Button>
          <Button
            id="test_button_3tank"
            className="units_item"
            appearance="image"
            onClick={() => {
              navigate("/game", {
                state: {
                  userRole: "Tank",
                },
              });
            }}
          >
            Трёхместный танк
            <img src={tank3} alt="Tank_3" />
          </Button>
          <Button
            id="test_button_infantrymanGun"
            className="units_item"
            appearance="image"
            onClick={() => {
              navigate("/game", {
                state: {
                  userRole: "Automat",
                },
              });
            }}
          >
            Пехотинец-автоматчик
            <img src={automat} alt="Automat" />
          </Button>
        </div>
        <div
          className={cn("lobby_block_right", {
            lobby_block_right_chat: isChatOpen,
          })}
        >
          <button
            className="chat_block"
            id="test-button-openCloseCchat"
            onClick={() => handleChat()}
          >
            <img src={chatIcon} />
            <span className="chat_text">Чат</span>
          </button>
          {isChatOpen ? (
            <>
              <Chat chatType={"game"} />
            </>
          ) : (
            <>
              <Dossier nick="Алексей" rang="Сержант" exp={230} needExp={300} />
              <Button
                id="test-button-goToMenu"
                onClick={logoutHandler}
                appearance="primary"
                className="logout_button"
              >
                Выйти из Бахмута
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
