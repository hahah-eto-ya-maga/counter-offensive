import { Button, Logo } from "../../components";
import { ISetPage } from "../../interfaces";
import "./MenuPage.css";

const MenuPage: React.FC<ISetPage> = ({ setPage }) => {
  return (
    <div className="menu_page_wrapper">
      <Logo />
      <div className="menu_buttons_block">
        <Button
          appearance="menu"
          className="menu_btn"
          onClick={() => {
            setPage("Lobby");
          }}
        >
          <p className="l">Вернуться на службу</p>
          <p className="s">Вернуться в лобби</p>
        </Button>
        <Button
          appearance="menu"
          className="menu_btn"
          onClick={() => {
            setPage("MainPage");
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
