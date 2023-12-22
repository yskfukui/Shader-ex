import { Effect } from "postprocessing";
import { AGCShader, EffectProps } from "../../utils/shader/agc";
import { forwardRef, useMemo } from "react";

// https://docs.pmnd.rs/react-postprocessing/effects/custom-effects

export type Props = EffectProps;

const cv = (window as any).cv;

type MakeGammaTableProps = {
  imgUrl: string;
  alpha: number;
};

export const MakeGammaTable = ({ imgUrl, alpha = 0.1 }: MakeGammaTableProps) => {
  // gammaList is LUT for gamma correction (from value to gamma)

  // ref
  /* S. -C. Huang, F. -C. Cheng and Y. -S. Chiu, 
  "Efficient Contrast Enhancement Using Adaptive Gamma Correction With Weighting Distribution," 
  in IEEE Transactions on Image Processing, vol. 22, no. 3, pp. 1032-1041, March 2013, 
  doi: 10.1109/TIP.2012.2226047. */

  const img = new Image();
  img.src = imgUrl;
  let gammaList: number[] = [];


  img.onload = () => {
    //  get v channel
    let src = cv.imread(img);
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_BGR2HSV);
    let hsvChannels = new cv.MatVector();
    cv.split(dst, hsvChannels);
    let v = new cv.MatVector();
    v.push_back(hsvChannels.get(2));

    // get cdf: cumulative distribution function
    let hist = new cv.Mat();
    let cdf = new cv.Mat();
    let pdf = new cv.Mat();
    let pdfw = new cv.Mat();

    let pixelCount = src.size().width * src.size().height;
    cv.calcHist(v, [0], new cv.Mat(), hist, [256], [0, 256]);
    hist.convertTo(pdf, cv.CV_32F, 1.0 / pixelCount);

    let minMaxLoc = cv.minMaxLoc(pdf);

    // eq(6)
    for (let i = 0; i < 256; i++) {
      pdfw[i] =
        minMaxLoc.maxVal *
        ((pdf.data32F[i] - minMaxLoc.minVal) /
          (minMaxLoc.maxVal - minMaxLoc.minVal)) **
          alpha;
    }

    let cdfSum = 0;
    for (let i = 0; i < 256; i++) {
      cdfSum += pdfw[i];
      cdf[i] = cdfSum;
    }
    for (let i = 0; i < 256; i++) {
      cdf[i] /= cdfSum;
    }

    // eq(9)
    for (let i = 0; i < 256; i++) {
      gammaList[i] = 1 - cdf[i];
    }

    // memory release
    src.delete();
    dst.delete();
    hsvChannels.delete();
    v.delete();
    hist.delete();
    cdf.delete();
    pdf.delete();
    pdfw.delete();
  };
  return gammaList;
};


class MyCustomEffectImpl extends Effect {
  constructor(props: EffectProps) {
    const shader = AGCShader({ ...props });
    super("MyCustomEffect", shader.fragmentShader, {
      uniforms: shader.uniforms,
    });
  }
}

export const AGCEffect = forwardRef<unknown, Props>((props, ref) => {
  const effect = useMemo(
    () =>
      new MyCustomEffectImpl({
        agcFlag: props.agcFlag,
        agcGammaList: props.agcGammaList,
      }),
    [props?.agcFlag]
  );
  return <primitive ref={ref} object={effect} dispose={null} />;
});

