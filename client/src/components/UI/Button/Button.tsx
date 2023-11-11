import React from "react";
import cn from "classnames";

import "./Button.css";

export interface ButtonProps
   extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
   > {
   appearance: "menu" | "primary" | "primary-disable" | "image";
   active?: boolean;
}

const Button: React.FC<ButtonProps> = ({
   appearance,
   className,
   children,
   active,
    id,
   ...props
}) => {
   return (
      <button
          id={id}
         className={cn(
            "button",
            {
               menu: appearance === "menu",
               primary:
                  appearance === "primary" || appearance === "primary-disable",
               disable: appearance === "primary-disable",
               image: appearance === "image",
               active,
            },
            className
         )}
         {...props}
      >
         {children}
      </button>
   );
};

export default Button;
