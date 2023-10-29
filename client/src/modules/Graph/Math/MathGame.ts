import { TWIN, TPoint } from "../../types/types";

interface IMath {
  WIN: TWIN;
}

class MathGame {
  WIN: TWIN;

  constructor(options: IMath) {
    const { WIN } = options;
    this.WIN = WIN;
  }

  calcCenter(polygon: TPoint[]): TPoint {
    const x = Math.abs(polygon[0].x - polygon[3].x) / 2;
    const y = Math.abs(polygon[0].y - polygon[3].y) / 2;
    return { x, y };
  }
}

export default MathGame;
