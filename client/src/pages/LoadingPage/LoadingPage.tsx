import React from "react";
import { ProgressBar, CardAdvise, Logo } from "../../components";
import "./LoadingPage.css";

const LoadingPage: React.FC = () => {
  return (
    <div className="logo_page_wrapper">
      <Logo />
      <CardAdvise />
      <ProgressBar />
    </div>
  );
};

export default LoadingPage;
