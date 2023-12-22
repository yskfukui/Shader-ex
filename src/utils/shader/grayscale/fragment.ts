// convert to grayscale image
export const fragmentShader = /* glsl */ `
	uniform sampler2D texture;
    uniform bool flag;

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        if (flag) {
            float gray = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
            outputColor = vec4(gray, gray, gray, 1.0);
        }else{
            outputColor = inputColor;
        }
    }
`;
