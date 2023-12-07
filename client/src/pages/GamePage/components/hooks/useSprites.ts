import { sprites } from "../../../../assets/png";

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
    }
}

function useSprites( SPRITE_SIZE:number, SIZE:number): {img: HTMLImageElement, anim: Function[], static: number[][]} {
    const img = new Image();
    img.src = sprites;

    const grass = [SPRITE_SIZE * 5, SIZE * 5, SIZE * 0, SIZE * 5]; 
    const stone = [SPRITE_SIZE, SIZE * 3, SIZE * 2, SIZE];
    const home = [SPRITE_SIZE * 3, SIZE * 0, SIZE * 0, SIZE * 3];
    const wall = [SPRITE_SIZE, SIZE * 3, SIZE * 5, SIZE];
    const bullet = [SPRITE_SIZE, SIZE * 3, SIZE * 0, SIZE];

    const manDead = [SPRITE_SIZE, SIZE * 4, SIZE * 0, SIZE];   
    const manRPG = [SPRITE_SIZE - 1, SIZE * 4, SIZE * 1, SIZE - 1];   //баг
    const manAutomat = [SPRITE_SIZE - 1, SIZE * 4, SIZE * 2, SIZE - 1];
    const manFlag = [SPRITE_SIZE - 1, SIZE * 4, SIZE * 3, SIZE - 1]; 

    const corpusTank2 = [SPRITE_SIZE * 2, SIZE * 0, SIZE * 6, SIZE * 2];
    const corpusTank3 = [SPRITE_SIZE * 2, SIZE * 0, SIZE * 11, SIZE * 2];
    const towerTank2 = [SPRITE_SIZE * 2, SIZE * 2, SIZE * 0, SIZE * 2];
    const towerTank3 = [SPRITE_SIZE * 2, SIZE * 0, SIZE * 0, SIZE * 2];
    // [
    //     [SPRITE_SIZE, SIZE * 0, SIZE * 2, SIZE],
    //     [SPRITE_SIZE, SIZE * 1, SIZE * 2, SIZE],
    //     [SPRITE_SIZE, SIZE * 2, SIZE * 2, SIZE],

    // ];

    const boom = getSpriteFromFrames([
        [SPRITE_SIZE, SIZE * 5,  SIZE * 0, SIZE],
        [SPRITE_SIZE, SIZE * 6,  SIZE * 0, SIZE],
        [SPRITE_SIZE, SIZE * 7,  SIZE * 0, SIZE],
    ]);
    const middleTank = getSpriteFromFrames([
        [SPRITE_SIZE, SIZE * 0, SIZE * 1, SIZE],
        [SPRITE_SIZE, SIZE * 1, SIZE * 1, SIZE],
    ]);
    const heavyTank = getSpriteFromFrames([
        [SPRITE_SIZE, SIZE * 0, SIZE * 1, SIZE],
        [SPRITE_SIZE, SIZE * 1, SIZE * 1, SIZE],
    ]);
    return {img: img, anim: [middleTank, heavyTank, boom], static: [grass, home, wall, stone, bullet, corpusTank2, corpusTank3, manAutomat, manRPG, manFlag]};
}

export default useSprites;