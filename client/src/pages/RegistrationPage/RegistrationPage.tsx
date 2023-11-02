import { Button, Registration } from "../../components";
import { ISetPage } from "../../interfaces";
import "./RegistrationPage.css";

const RegistrationPage: React.FC<ISetPage> = ({ setPage }) => {
  return (
    <div className="reg_wrapper">
      <div className="reg_header">
        <Button appearance="primary-disable" id="test_reg_pageName_button">
          Повестка
        </Button>
        <Button
          appearance="primary"
          id="test_reg_goToMain_button"
          onClick={() => {
            setPage("MainPage");
          }}
        >
          Уже служил
        </Button>
      </div>
      <div className="reg_content">
        <Registration setPage={setPage} />
      </div>
    </div>
  );
};

export default RegistrationPage;
