import { Button, Login } from "../../components";
import { ISetPage } from "../../interfaces";
import "../MenuPage/MenuPage.css";

const MainPage: React.FC<ISetPage> = ({ setPage }) => {
  return (
    <div className="main_wrapper">
      <div className="main_header">
        <Button appearance="primary-disable" id="test_login_pageName_button">
          Уже служил
        </Button>
        <Button
          appearance="primary"
          id="test_login_goToReg_button"
          onClick={() => {
            setPage("Registration");
          }}
        >
          Получить повестку
        </Button>
      </div>
      <div className="main_content">
        <Login setPage={setPage} />
      </div>
    </div>
  );
};

export default MainPage;
