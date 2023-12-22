import { Uniform } from "three";
import { fragmentShader } from "./fragment";

export type EffectProps = {
  flag?: boolean;
};

export const GrayShader = ({ flag = true }: EffectProps) => ({
  uniforms: new Map<string, Uniform>([
    ["texture", new Uniform(null)],
    ["flag", new Uniform(flag)],
  ]),
  fragmentShader,
});
