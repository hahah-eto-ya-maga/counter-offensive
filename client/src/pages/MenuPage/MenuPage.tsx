import { FC } from "react";
import { Button, Logo } from "../../components";
import "./MenuPage.css";

const MenuPage: FC = () => {
  return (
    <div className="menu_page_wrapper">
      <Logo />
      <div className="menu_buttons_block">
        <Button
          appearance="menu"
          id="test_menu_goToLobby_button"
          className="menu_btn"
        >
          <p className="l">Вернуться на службу</p>
          <p className="s">Вернуться в лобби</p>
        </Button>
        <Button
          appearance="menu"
          id="test_menu_goToMain_button"
          className="menu_btn"
        >
          <p className="l">Дембельнуться</p>
          <p className="s">Выйти из аккаунта</p>
        </Button>
      </div>
    </div>
  );
};

export default MenuPage;
