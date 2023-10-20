import React, { useState } from "react";
import cn from "classnames";

import "./Input.css";
import Eye from "../Eye/Eye";

type TType = "password" | "text";

interface IInputProps {
  text: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: TType;
}

const Input: React.FC<IInputProps> = ({
  text,
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
          value={value}
          onChange={onChangeHandler}
          type={inputType}
        />
        {type === "password" ? (
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
