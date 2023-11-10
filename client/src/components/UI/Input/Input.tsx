import React, { useState } from "react";
import Eye from "../Eye/Eye";
import cn from "classnames";

import "./Input.css";

type TType = "password" | "text" | "hidePassword";

interface IInputProps {
  id: string;
  text: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: TType;
}

const Input: React.FC<IInputProps> = ({
  text,
  id,
  className,
  value,
  type = "text",
  onChange,
}) => {
  const [inputType, setInputType] = useState<TType>(type);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const changeType = () => {
    setInputType(inputType === "text" ? "password" : "text");
  };

  return (
    <div className="input_box">
      <div className="input_text">
        <span className="span_text">{text}</span>
      </div>
      <div className="input_wrapper">
        <input
          className={cn("input_value", className)}
          id={id}
          value={value}
          onChange={onChangeHandler}
          type={inputType === "text" ? "text" : "password"}
          autoComplete="off"
        />
        {type === "hidePassword" ? (
          <div className="toggle_password" onClick={changeType}>
            <Eye open={inputType === "text"} />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Input;
