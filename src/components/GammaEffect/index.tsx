import { Effect } from "postprocessing";
import { GammaShader, EffectProps } from "../../utils/shader/gamma";
import { forwardRef, useMemo } from "react";

// https://docs.pmnd.rs/react-postprocessing/effects/custom-effects

export type Props = EffectProps;

class MyCustomEffectImpl extends Effect {
  constructor(props: EffectProps) {
    const shader = GammaShader({ ...props });
    super("MyCustomEffect", shader.fragmentShader, {
      uniforms: shader.uniforms,
    });
  }
}

const GammaEffect = forwardRef<unknown, Props>((props, ref) => {
  const effect = useMemo(
    () =>
      new MyCustomEffectImpl({
        gammaFactor: props.gammaFactor,
      }),
    [props?.gammaFactor]
  );
  return <primitive ref={ref} object={effect} dispose={null} />;
});

export default GammaEffect;
