import React from "react";
import cn from "classnames";

import "./Input.css";

interface IInputProps {
  text: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: "password" | "email" | "text";
}

const Input: React.FC<IInputProps> = ({
  text,
  className,
  value,
  type,
  onChange,
}) => {
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="input_box">
      <div className="input_text">
        <span className="span_text">{text}</span>
      </div>
      <input
        className={cn("input_value", className)}
        value={value}
        onChange={onChangeHandler}
        type={type ?? "text"}
      />
    </div>
  );
};

export default Input;
