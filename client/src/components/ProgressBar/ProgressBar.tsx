import React, { useEffect, useState } from "react";
import "./ProgressBar.css";

const ProgressBar: React.FC = () => {
   const [progress, setProgress] = useState<number>(20);

   useEffect(() => {
      const interval = setInterval(() => {
         const newProgress = progress + Math.round(Math.random() * 15);
         setProgress(newProgress <= 100 ? newProgress : 100);
         if (progress >= 100) {
            clearInterval(interval);
         }
      }, Math.random() * 900);
      return () => {
         clearInterval(interval);
      };
   });
   return (
      <div className="progress_wrapper">
         <span>Загрузка...</span>
         <div className="progress_bar">
            <div className="progress" style={{ width: `${progress}%` }}>
               {progress < 100 && progress > 0 && (
                  <div className="triangle"></div>
               )}
            </div>
            <span className="progress_text">{progress}/100%</span>
         </div>
      </div>
   );
};

export default ProgressBar;
