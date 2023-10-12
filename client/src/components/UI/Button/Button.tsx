import React from "react";
import cn from "classnames";
import "./Button.css";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  appearance: "primary" | "menu" | "image";
}

const Button = ({
  appearance,
  children,
  className,
  ...props
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={cn("button", className, {
        ["primary"]: appearance === "primary",
        ["menu"]: appearance === "menu",
        ["image"]: appearance === "image"
      })}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;