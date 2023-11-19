import { FC } from "react";
import { Button, Registration } from "../../components";
import "./RegistrationPage.css";
import { Link } from "react-router-dom";

const RegistrationPage: FC = () => {
  return (
    <div className="reg_wrapper">
      <div className="reg_header">
        <div>
          <Button appearance="primary-disable" id="test_reg_pageName_button">
            Повестка
          </Button>
        </div>
        <div>
          <Link to='/authorization'>
          <Button appearance="primary" id="test_reg_goToMain_button">
            Уже служил
          </Button>
          </Link>
        </div>
      </div>
      <div className="reg_content">
        <Registration />
      </div>
    </div>
  );
};

export default RegistrationPage;
