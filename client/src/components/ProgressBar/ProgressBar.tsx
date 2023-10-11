import React, { useEffect, useState } from "react";
import "./ProgressBar.css";

/* interface IProgressBarProps {
   progress1: number;
} */

const ProgressBar: React.FC = () => {
   const [progress, setProgress] = useState<number>(0);

   useEffect(() => {
      const interval = setInterval(() => {
         const newProgress = progress + Math.round(Math.random() * 15);
         setProgress(newProgress <= 100 ? newProgress : 100);
         if (progress >= 100) {
            clearInterval(interval);
         }
      }, Math.random() * 700);
      return () => {
         clearInterval(interval);
      };
   });
   return (
      <div className="progress_wrapper">
         <span>Загрузка...</span>
         <div className="progress_bar">
            <div className="progress" style={{ width: `${progress}%` }} />
            <span className="progress_text">{progress}/100%</span>
         </div>
      </div>
   );
};

export default ProgressBar;
