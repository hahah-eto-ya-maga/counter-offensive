import React, { useEffect, useState } from "react";
import "./CardAdvice.css";

const CardAdvise: React.FC = () => {
   const [advice, setAdvice] = useState<string>(
      `Рандомный совет №${Math.round(Math.random() * 20)}`
   );

   useEffect(() => {
      const interval = setInterval(() => {
         setAdvice(`Рандомный совет №${Math.round(Math.random() * 20)+1}`);
      }, 1000 + Math.random() * 3000);
      return () => clearInterval(interval);
   });

   return <div className="card_advise">{advice}</div>;
};

export default CardAdvise;
