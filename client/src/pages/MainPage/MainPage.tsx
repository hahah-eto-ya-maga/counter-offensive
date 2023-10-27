import { Button, Login } from "../../components";
import { TPage } from "../PageHandler/PageHandler";
import "../MenuPage/MenuPage.css";

interface IMain {
  setPage: React.Dispatch<React.SetStateAction<TPage>>;
}

const MainPage: React.FC<IMain> = ({ setPage }) => {
  return (
    <div className="main_wrapper">
      <div className="main_header">
        <Button appearance="primary-disable" active>
          Уже служил
        </Button>
        <Button appearance="primary">Получить повестку</Button>
      </div>
      <div className="main_content">
        <Login setPage={setPage} />
      </div>
    </div>
  );
};

export default MainPage;
