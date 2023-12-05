import { sprites } from "../../../../assets/pngs";

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

function useSprites( SPRITE_SIZE:number, SIZE:number): [HTMLImageElement, number[], number[], number[], number[], number[], number[], number[], number[], Function, Function, Function] {
    const img = new Image();
    img.src = sprites;

    const grass = [SPRITE_SIZE*5, SIZE*5, SIZE*0, SIZE*5]; 
    const stone = [SPRITE_SIZE, SIZE * 4, SIZE * 2, SIZE];
    const bullet = [SPRITE_SIZE, SIZE * 3, SIZE * 0, SIZE];
    const home = [SPRITE_SIZE*4, SIZE * 0, SIZE * 3, SIZE*4];

    const manRPG = [SPRITE_SIZE, SIZE * 4, SIZE * 3, SIZE];
    const manAutomat = [SPRITE_SIZE, SIZE * 4, SIZE * 4, SIZE];

    const tank2 =   [SPRITE_SIZE*1.2, SIZE * 2, SIZE * 0, SIZE*1.2];
    const tank3 =   [SPRITE_SIZE*1.3, SIZE * 0, SIZE * 0, SIZE*1.3];
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
    return [img, grass, home, stone, bullet, tank2, tank3, manAutomat, manRPG, middleTank, heavyTank, boom];
}

export default useSprites;