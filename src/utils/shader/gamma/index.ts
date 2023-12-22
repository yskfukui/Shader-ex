import { Uniform } from "three";
import { fragmentShader } from "./fragment";

export type EffectProps = {
  gammaFactor?: number;
};

export const GammaShader = ({ gammaFactor = 1.0 }: EffectProps) => ({
  uniforms: new Map<string, Uniform>([
    ["texture", new Uniform(null)],
    ["gammaFactor", new Uniform(gammaFactor)],
  ]),
  fragmentShader,
});
