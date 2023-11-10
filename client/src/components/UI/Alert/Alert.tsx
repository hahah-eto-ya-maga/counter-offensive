import React from "react";
import "./Alert.css";

export interface IAlertProps {
  alertMessage: string;
  alertStyle: "warning" | "error";
}

export const Alert: React.FC<IAlertProps> = ({alertMessage,alertStyle}) => {
  return (
    <div className={alertStyle}>
      <div>{alertMessage}</div>
    </div>
  );
};
