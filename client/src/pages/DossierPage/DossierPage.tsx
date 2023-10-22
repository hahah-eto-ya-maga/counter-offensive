import React, { useState } from "react";
import { Info, Shop } from "../../components";

import "./DossierPage.css";

const DossierPage: React.FC = () => {
   const [pageType, setPageType] = useState<"info" | "shop">("info");
   const user = {
      login: "Vasya",
      gamesCount: 4,
      expCount: 32,
      rang: "Хомяк",
   };
   return (
      <div className="dossier_page">
         {pageType === "info" ? (
            <Info {...user} changePage={setPageType} />
         ) : (
            <Shop />
         )}
      </div>
   );
};

export default DossierPage;
