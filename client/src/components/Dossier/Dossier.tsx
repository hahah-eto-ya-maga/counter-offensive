import React, { useState } from "react";
import Info from "./Info/Info";
import Shop from "./Shop/Shop";

import "./Dossier.css";

export const Dossier: React.FC = () => {
   const [pageType, setPageType] = useState<"info" | "shop">("info");
   const user = {
      login: "Vasya",
      gamesCount: 4,
      expCount: 32,
      rang: "Хомяк",
   };
   return (
      <div className="dossier">
         {pageType === "info" ? (
            <Info {...user} changePage={setPageType} />
         ) : (
            <Shop />
         )}
      </div>
   );
};

