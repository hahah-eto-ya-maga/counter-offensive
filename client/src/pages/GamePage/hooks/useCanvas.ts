import { Canvas } from "../modules";
import { ICanvasOption } from "../modules/Graph/Canvas/Canvas";

const useCanvas = (
   render = (FPS: number) => {}
): ((params: ICanvasOption) => Canvas) => {
   let FPS = 0;
   let outFPS = 0;
   let lastTimestamp = Date.now();
   const animLoop = () => {
      FPS++;
      const timestamp = Date.now();
      if (timestamp - lastTimestamp >= 1000) {
         outFPS = FPS;
         FPS = 0;
         lastTimestamp = timestamp;
      }
      render(outFPS);
      window.requestAnimationFrame(animLoop);
   };

   return (params: ICanvasOption) => {
      animLoop();
      return new Canvas(params);
   };
};
export default useCanvas;
