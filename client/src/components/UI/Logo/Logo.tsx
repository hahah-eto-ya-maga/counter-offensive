import { FC } from "react";

import LogoSRC from "./Logo.png";
import "./Logo.css";


const Logo: FC = () => {
   return (
      <img src={LogoSRC} className="logo" alt="counter-nastup"/>
   );
};

export default Logo;
