import React, { useState } from "react";
import { Button } from "../../UI";
import "./Shop.css";

type TPage = "shop" | "showcase";

const Shop: React.FC = () => {
   const [pageContent, setPageContent] = useState<TPage>("showcase");

   return (
      <div className="dossier_shop">
         <div className="shop_menu">
            <Button
               id="test_button_showcaseOfAchievements"
               className="dossier_button"
               active={pageContent === "showcase"}
               appearance="primary"
               onClick={() => setPageContent("showcase")}
            >
               Витрина достижений
            </Button>
            <Button
               id="test_button_shopOfAchivement"
               className="dossier_button"
               active={pageContent === "shop"}
               appearance="primary"
               onClick={() => setPageContent("shop")}
            >
               Магазин достижений
            </Button>
         </div>
         <div className="shop_content">
            {pageContent === "shop" ? (
               <>
                  <span>
                     “Тут достижения, которые игрок может купить за золото”
                  </span>
               </>
            ) : (
               <>
                  <span>“Тут достижения, уже купленные игроком”</span>
               </>
            )}
         </div>
      </div>
   );
};

export default Shop;
