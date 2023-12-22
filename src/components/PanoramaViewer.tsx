// src/components/Image.js
import { Canvas, useLoader, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import { FC, Suspense, useEffect, useRef, useState } from "react";
import { TextureLoader, } from "three";

import GrayEffect from "./GrayEffect";
import GammaEffect from "./GammaEffect";
import { AGCEffect, MakeGammaTable }  from "./AGCEffect";

type Props = {
  imgUrl: string;
};

const PanoramaImage = ({ imgUrl }: { imgUrl: string }) => {
  const texture = useLoader(TextureLoader, imgUrl);
  const { scene } = useThree();
  scene.background = texture;

  return null;
};



export const FCPanoramaViewer: FC<Props> = ({ imgUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [grayflag, setGrayflag] = useState(false);
  const [gammaFactor, setGammaFactor] = useState(1.0);
  const [agcFlag, setAgcFlag] = useState(false);
  const [gammaList, setGammaList] = useState<number[]>([]);

  useEffect(() => {
    // set gammaList
    setGammaList(MakeGammaTable({ imgUrl: imgUrl, alpha : 0.5 }));
  }, [imgUrl]);

  return (
    <div className="fullScreenContainer">
      <button onClick={() => setGrayflag(!grayflag)}>gray</button>
      <input
        type="range"
        min="0.0"
        max="2.0"
        step="0.2"
        value={gammaFactor}
        onChange={(e) => setGammaFactor(parseFloat(e.target.value))}
      />
      <button onClick={() => setAgcFlag(!agcFlag)}>agc</button>

      <Canvas
        style={{
          width: "80%",
          height: "80%",
        }}
        ref={canvasRef}
        camera={{ position: [0, 0, 0] }}
        gl={{ preserveDrawingBuffer: true }}
        flat
        linear
      >
        <Suspense fallback={null}>
          <PanoramaImage imgUrl={imgUrl} />
        </Suspense>
        <EffectComposer>
          <GrayEffect flag={grayflag} />
          <GammaEffect gammaFactor={gammaFactor} />
          <AGCEffect agcFlag={agcFlag} agcGammaList = {gammaList} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default FCPanoramaViewer;
