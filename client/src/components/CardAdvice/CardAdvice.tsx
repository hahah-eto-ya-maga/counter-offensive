import React, { useEffect, useState } from "react";
import "./CardAdvice.css";

const CardAdvise: React.FC = () => {
   const [advice, setAdvice] = useState<string>(generateAdvice());

   useEffect(() => {
      const interval = setInterval(() => {
         setAdvice(generateAdvice());
      }, 1000 + Math.random() * 3000);
      return () => clearInterval(interval);
   });

   function generateAdvice(): string {
      return `Рандомный совет №${Math.round(Math.random() * 20) + 1}`;
   }

   return <div className="card_advise">{advice}</div>;
};

export default CardAdvise;
