import { gras } from "../../../../assets/pngs";

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

function useSprites( SPRITE_SIZE:number, SIZE:number): [HTMLImageElement, number[], number[], number[], number[][], Function, Function, Function] {
    const img = new Image();
    img.src = gras;

    const grass= [SPRITE_SIZE*12, SIZE * 0, SIZE * 0, SIZE*0]; 
    const stone = [SPRITE_SIZE, SIZE * 4, SIZE * 2, SIZE];
    const bullet = [SPRITE_SIZE, SIZE * 3, SIZE * 0, SIZE];

    const homes = [
        [SPRITE_SIZE, SIZE * 0, SIZE * 2, SIZE],
        [SPRITE_SIZE, SIZE * 1, SIZE * 2, SIZE],
        [SPRITE_SIZE, SIZE * 2, SIZE * 2, SIZE],

    ];

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
    return [img, grass, stone, bullet, homes, middleTank, heavyTank, boom];
}

export default useSprites;