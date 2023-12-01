import { useState, FC } from "react";
import Shop from "./Shop/Shop";
import { Button } from "../UI";
import "./Dossier.css";

interface IDossierProps {
  exp: number;
  needExp: number;
  nick: string;
  rang: string;
}

export const Dossier: FC<IDossierProps> = ({ nick, rang, exp, needExp }) => {
  return (
    <div className="dossier">
      <div className="dossier_user">
        <div className="dossier_image">
          <img src="https://i.ibb.co/BggNK9x/photo-2022-11-06-16-27-39.jpg" />
        </div>
        <div className="dossier_info">
          <p className="user_name">Алексей</p>
          <p className="user_rang">Сержант</p>
        </div>
        <Button
          id="test_button_showcaseOfAchievements"
          appearance="primary"
          className="achievements_button"
        >
          Витрина достижений
        </Button>
      </div>
      <div className="dossier_exp_progress">
        <div className="dossier_exp_progress_bar">
          <div
            className="exp_progress"
            style={{ width: `${exp / needExp * 100}%` }}
            />
            <span>{`${exp}/${needExp}`}</span>
        </div>
      </div>
    </div>
  );
};
