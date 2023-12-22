import { Uniform } from "three";
import { fragmentShader } from "./fragment";


export type EffectProps = {
  agcFlag?: boolean;
  agcGammaList?: number[];
};

export const AGCShader = ({ agcFlag = false, agcGammaList = [] }: EffectProps) => ({
  uniforms: new Map<string, Uniform>([
    ["texture", new Uniform(null)],
    ["agcFlag", new Uniform(agcFlag)],
    ["agcGammaList", new Uniform(agcGammaList)],
  ]),
  fragmentShader,
});
