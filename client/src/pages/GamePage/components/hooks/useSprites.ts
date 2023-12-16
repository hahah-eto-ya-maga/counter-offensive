import { sprites } from "../../../../assets/png";

type SpriteFrame = [number, number, number, number];
type SpriteFunc = (id: number) => number[];

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
   const stone: SpriteFrame = [SPRITE_SIZE * 2.3 - 1, SIZE * 6, SIZE * 4, SIZE * 2 - 1];
   const home: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 0, SIZE * 0, SIZE * 6];
   const wall: SpriteFrame = [SPRITE_SIZE, SIZE * 6, SIZE * 10, SIZE];
   const bullet: SpriteFrame = [SPRITE_SIZE, SIZE * 3, SIZE * 0, SIZE];

   const manDead: SpriteFrame = [SPRITE_SIZE * 2, SIZE * 8, SIZE * 0, SIZE * 2];
   const manRPG: SpriteFrame = [SPRITE_SIZE * 2 - 1, SIZE * 8, SIZE * 2, SIZE * 2 - 1]; //баг
   const manAutomat: SpriteFrame = [SPRITE_SIZE * 2 - 1, SIZE * 8, SIZE * 4, SIZE * 2 - 1 ];
   const manFlag: SpriteFrame = [SPRITE_SIZE * 2 - 1, SIZE * 8, SIZE * 6, SIZE * 2 - 1];

   const corpusTank2: SpriteFrame = [SPRITE_SIZE * 4, SIZE * 0, SIZE * 12, SIZE * 4];
   const corpusTank3: SpriteFrame = [SPRITE_SIZE * 4, SIZE * 0, SIZE * 22, SIZE * 4];
   const towerTank2: SpriteFrame = [SPRITE_SIZE * 6 - 1, SIZE * 0, SIZE * 6, SIZE * 6 - 1];
   const towerTank3: SpriteFrame = [SPRITE_SIZE * 6, SIZE * 0, SIZE * 16, SIZE * 6];

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
      home,
      wall,
      bullet,
      manDead,
      manRPG,
      manAutomat,
      manFlag,
      corpusTank2,
      corpusTank3,
      towerTank2,
      towerTank3,
   ];
};

export default useSprites;
