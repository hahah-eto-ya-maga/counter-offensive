import { sprites } from "../../../assets/png";

export type SpriteFrame = [number, number, number, number];
export type SpriteFunc = (id: number) => number[];

const getSpriteFromFrames = (frames: number[][]) => {
   let i = 0;
   let counts = 0;
   return (id: number) => {
      if (id) {
         if (counts >= 0) {
            counts++;
            if (counts >= frames.length) {
               counts = 0;
            }
         } else {
            counts = 0;
         }
         return frames[counts];
      }
      i++;
      if (i >= frames.length) {
         i = 0;
      }
      return frames[i];
   };
};

const useSprites = (
   SPRITE_SIZE: number,
   SIZE: number
): [HTMLImageElement, SpriteFunc, SpriteFunc, SpriteFunc, ...SpriteFrame[]] => {
   const img = new Image();
   img.src = sprites;

   const grass: SpriteFrame = [SPRITE_SIZE * 10, SIZE * 10, SIZE * 0, SIZE * 10];
   const stone: SpriteFrame = [SPRITE_SIZE * 2.2 - 1, SIZE * 6, SIZE * 4, SIZE * 2 - 1];
   const wall: SpriteFrame = [SPRITE_SIZE, SIZE * 6, SIZE * 10, SIZE];
   const bush:  SpriteFrame = [SPRITE_SIZE * 2, SIZE * 6 + 1, SIZE * 2, SIZE * 2];
   const stump: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 6, SIZE * 16, SIZE * 2 ];
   const spike: SpriteFrame = [SPRITE_SIZE, SIZE * 9, SIZE * 16, SIZE ];
   const box: SpriteFrame = [SPRITE_SIZE, SIZE * 6, SIZE * 6, SIZE ];
   const sand: SpriteFrame=[SPRITE_SIZE * 3, SIZE * 6.05, SIZE * 12.2, SIZE * 3]

   const home: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 0, SIZE * 0, SIZE * 6];
   const veranda: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 6.01, SIZE * 0, SIZE * 2];
   
   const road:  SpriteFrame = [SPRITE_SIZE * 4, SIZE * 22, SIZE * 0, SIZE * 4];
   const crossyRoadEnd: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 17, SIZE * 13, SIZE * 2];
   const crossyRoad: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 19, SIZE * 11, SIZE * 2];
   const crossyRoadTurn: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 19, SIZE * 13, SIZE * 2];
   const crossyRoadTurnCont: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 17, SIZE * 11, SIZE * 2];

   const fence: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 10, SIZE * 13, SIZE * 2]
   const fenceTurn: SpriteFrame = [SPRITE_SIZE, SIZE * 13, SIZE * 13, SIZE]
   

   const bulletAutomat: SpriteFrame = [SPRITE_SIZE, SIZE * 8, SIZE * 8, SIZE];
   const bulletRPG: SpriteFrame = [SPRITE_SIZE, SIZE * 8, SIZE * 10, SIZE];

   const manDead: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 8, SIZE * 0, SIZE * 1.99];
   const manRPG: SpriteFrame = [SPRITE_SIZE * 2 - 1, SIZE * 8, SIZE * 2, SIZE * 2 - 1]; 
   const manAutomat: SpriteFrame = [SPRITE_SIZE * 2 , SIZE * 8.01, SIZE * 4, SIZE * 2 - 1  ];
   const manFlag: SpriteFrame = [SPRITE_SIZE * 2 - 1, SIZE * 8, SIZE * 6, SIZE * 2 - 1];

   const mobDead: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 14, SIZE * 11, SIZE * 2];
   const mobRPG: SpriteFrame = [SPRITE_SIZE * 2 - 1, SIZE * 10, SIZE * 11, SIZE * 2 - 1]; 
   const mobAutomat: SpriteFrame = [SPRITE_SIZE * 2 - 1, SIZE * 12, SIZE * 11, SIZE * 2 - 1];

   const corpusTank2: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 0, SIZE * 6, SIZE * 5.9];
   const towerTank2: SpriteFrame = [SPRITE_SIZE * 6 - 1, SIZE * 0, SIZE * 12, SIZE * 6 - 1];
   const corpusTank3: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 10, SIZE * 18, SIZE * 6];
   const towerTank3: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 10, SIZE * 24, SIZE * 6];
   
   const corpusTank2Dead: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 0, SIZE * 18, SIZE * 6];
   const towerTank2Dead: SpriteFrame = [SPRITE_SIZE * 6 - 1, SIZE * 0, SIZE * 24, SIZE * 6 - 1];
   const corpusTank3Dead: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 16, SIZE * 18, SIZE * 6];
   const towerTank3Dead: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 16, SIZE * 24, SIZE * 6];

   const boom: SpriteFunc = getSpriteFromFrames([
      [SPRITE_SIZE, SIZE * 5, SIZE * 0, SIZE],
      [SPRITE_SIZE, SIZE * 6, SIZE * 0, SIZE],
      [SPRITE_SIZE, SIZE * 7, SIZE * 0, SIZE],
   ]);

   const middleTank: SpriteFunc = getSpriteFromFrames([
      [SPRITE_SIZE, SIZE * 0, SIZE * 1, SIZE],
      [SPRITE_SIZE, SIZE * 1, SIZE * 1, SIZE],
   ]);

   const heavyTank: SpriteFunc = getSpriteFromFrames([
      [SPRITE_SIZE, SIZE * 0, SIZE * 1, SIZE],
      [SPRITE_SIZE, SIZE * 1, SIZE * 1, SIZE],
   ]);

   return [
      img,
      boom,
      middleTank,
      heavyTank,
      grass,
      stone,
      bush,
      stump,
      spike,
      box,
      sand,
      home,
      veranda,
      wall,
      road,
      crossyRoadEnd,
      crossyRoad,
      crossyRoadTurn,
      crossyRoadTurnCont,
      fence,
      fenceTurn,
      bulletAutomat,
      bulletRPG,
      manDead,
      manRPG,
      manAutomat,
      manFlag,
      mobDead,
      mobRPG,
      mobAutomat,
      corpusTank2,
      corpusTank3,
      towerTank2,
      towerTank3,
      corpusTank2Dead,
      corpusTank3Dead,
      towerTank2Dead,
      towerTank3Dead,
   ];
};

export default useSprites;
