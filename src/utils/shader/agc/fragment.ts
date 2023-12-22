// convert to grayscale image
export const fragmentShader = /* glsl */ `
	uniform sampler2D texture;
    uniform bool agcFlag;
    uniform float agcGammaList[256];

    // hsv and rgb
    // https://gist.github.com/983/e170a24ae8eba2cd174f

    vec3 rgb2hsv(vec3 c){
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c){
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

        if (agcFlag) {
            vec3 hsv = rgb2hsv(inputColor.rgb);
            float v = hsv[2];
            int v_int = int(v * 255.0);
            float corrected_v = pow(v, agcGammaList[v_int]);
            vec3 corrected_hsv = vec3(hsv[0], hsv[1], corrected_v);
            vec3 corrected_rgb = hsv2rgb(corrected_hsv);
            outputColor = vec4(corrected_rgb, 1.0);
        } else {
            outputColor = inputColor;
        }
    }
`;
