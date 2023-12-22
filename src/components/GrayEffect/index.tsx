import { Effect } from "postprocessing";
import { GrayShader, EffectProps } from "../../utils/shader/grayscale";
import { forwardRef, useMemo } from "react";
import { EffectComposer } from "@react-three/postprocessing";

// https://docs.pmnd.rs/react-postprocessing/effects/custom-effects

export type Props = EffectProps;

class MyCustomEffectImpl extends Effect {
  constructor(props: EffectProps) {
    const shader = GrayShader({ ...props });
    super("MyCustomEffect", shader.fragmentShader, {
      uniforms: shader.uniforms,
    });
  }
}

const GrayEffect = forwardRef<unknown, Props>((props, ref) => {
  const effect = useMemo(
    () =>
      new MyCustomEffectImpl({
        flag: props.flag,
      }),
    [props?.flag]
  );
  return <primitive ref={ref} object={effect} dispose={null} />;
});

export default GrayEffect;
