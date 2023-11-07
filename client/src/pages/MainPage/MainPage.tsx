import { Button, Logo } from "../../components";
import { TPage } from "../PageHandler/PageHandler";
import "../MenuPage/MenuPage.css";

interface IMenu {
  goToLogin: React.Dispatch<React.SetStateAction<TPage>>;
}

const MainPage: React.FC<IMenu> = ({ goToLogin }) => {
  return (
    <div className="menu_page_wrapper">
      <Logo />
      <div className="menu_buttons_block">
        <Button
          appearance="menu"
          className="menu_btn"
          onClick={() => {
            goToLogin("Lobby");
          }}
        >
          <p className="l">Вернуться на службу</p>
          <p className="s">Авторизация</p>
        </Button>
        <Button
          appearance="menu"
          className="menu_btn"
        >
          <p className="l">Получить повестку</p>
          <p className="s">Регистрация</p>
        </Button>
      </div>
    </div>
  );
};

export default MainPage;
