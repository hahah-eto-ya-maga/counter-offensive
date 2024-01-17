import {
   MAP_SIZE,
   entitiesConfig,
   objectConf,
   walls,
} from "../../../../../config";
import { EBody, EMapObject } from "../../../../../modules/Server/interfaces";
import { IGameScene } from "../Game";
import { TCircle, TPoint, TUnit } from "../../../types";

class Collision {
   scene: IGameScene;
   constructor(scene: IGameScene) {
      this.scene = scene;
   }

   blockUnit(unit: TUnit, block: TPoint, width: number, height: number) {
      const centerBlock: TPoint = {
         x: block.x + width / 2,
         y: block.y - height / 2,
      };

      const distance: TPoint = {
         x: unit.x - centerBlock.x,
         y: unit.y - centerBlock.y,
      };

      const sumOfRad: TPoint = {
         x: width / 2 + unit.r,
         y: height / 2 + unit.r,
      };

      if (
         Math.abs(distance.x) < sumOfRad.x &&
         Math.abs(distance.y) < sumOfRad.y
      ) {
         const overlap: TPoint = {
            x: sumOfRad.x - Math.abs(distance.x),
            y: sumOfRad.y - Math.abs(distance.y),
         };

         if (overlap.x < overlap.y) {
            unit.x += distance.x > 0 ? overlap.x : -overlap.x;
         } else {
            unit.y += distance.y > 0 ? overlap.y : -overlap.y;
         }
      }
   }

   circleUnit(unit: TUnit, circle: TCircle) {
      const distance: TPoint = {
         x: unit.x - circle.x,
         y: unit.y - circle.y,
      };

      const distanceLength = Math.max(
         Math.sqrt(distance.x ** 2 + distance.y ** 2),
         0.0001
      );

      const sumOfRad: number = circle.r + unit.r;

      if (distanceLength < sumOfRad) {
         const normVect: TPoint = {
            x: distance.x / distanceLength,
            y: distance.y / distanceLength,
         };

         const overlap = sumOfRad - distanceLength;

         unit.x += normVect.x * overlap;
         unit.y += normVect.y * overlap;
      }
   }

   bordersUnit(unit: TUnit) {
      const { x, y, r } = unit;
      if (x - r < 0) {
         unit.x = r;
      }
      if (x + r > MAP_SIZE.width) {
         unit.x = MAP_SIZE.width - r;
      }
      if (y - r < 0) {
         unit.y = r;
      }
      if (y + r > MAP_SIZE.height) {
         unit.y = MAP_SIZE.height - r;
      }
   }

   checkAllBlocksUnit(unit: TUnit): void {
      this.scene.map.forEach((obj) => {
         const { x, y, sizeX, sizeY } = obj;
         const { stoneR } = objectConf;
         switch (obj.type) {
            case EMapObject.house: {
               this.blockUnit(unit, { x, y }, sizeX, sizeY);
               break;
            }
            case EMapObject.stone: {
               this.circleUnit(unit, { x, y, r: stoneR });
               break;
            }
         }
      });

      this.scene.bodies.forEach((body) => {
         if (body.type === EBody.heavyTank) {
            this.circleUnit(unit, {
               ...body,
               r: entitiesConfig.middleTank.corpusR,
            });
         }
         if (body.type === EBody.middleTank) {
            this.circleUnit(unit, {
               ...body,
               r: entitiesConfig.heavyTank.corpusR,
            });
         }
      });

      this.bordersUnit(unit);
   }
}

export default Collision;
