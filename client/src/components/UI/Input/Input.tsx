import React, { useState } from "react";
import Eye from "../Eye/Eye";
import cn from "classnames";

import "./Input.css";

type TType = "password" | "text";

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
      <div className="input_wrapper">
         <input
            type={inputType}
            onChange={onChangeHandler}
            placeholder={text}
            className={cn("input_element", {
               input_password: type === "password",
            })}
         />
         {type === "password" && (
            <div onClick={changeType} className="eye">
               <Eye open={inputType === "text"} />
            </div>
         )}
      </div>
   );
};

export default Input;
