import { Button, Logo } from "../../components";
import { TPage } from "../PageHandler/PageHandler";
import "./MenuPage.css";

interface IMenu {
  goToLobby: React.Dispatch<React.SetStateAction<TPage>>;
  goToMain: React.Dispatch<React.SetStateAction<TPage>>;
}

const MenuPage: React.FC<IMenu> = ({ goToLobby, goToMain }) => {
  return (
    <div className="menu_page_wrapper">
      <Logo />
      <div className="menu_buttons_block">
        <Button
          appearance="menu"
          className="menu_btn"
          onClick={() => {
            goToLobby("Lobby");
          }}
        >
          <p className="l">Вернуться на службу</p>
          <p className="s">Вернуться в лобби</p>
        </Button>
        <Button
          appearance="menu"
          className="menu_btn"
          onClick={() => {
            goToMain("MainPage");
          }}
        >
          <p className="l">Дембельнуться</p>
          <p className="s">Выйти из аккаунта</p>
        </Button>
      </div>
    </div>
  );
};

export default MenuPage;
