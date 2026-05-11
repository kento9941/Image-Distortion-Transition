uniform sampler2D u_currentImage;
uniform sampler2D u_prevImage;
uniform sampler2D u_displacement;
uniform float u_progress;
uniform vec2 u_uvScale;
varying vec2 v_uv;

const float PI = 3.1415926535;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.7, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = (v_uv - 0.5) * u_uvScale + 0.5;

    // higest at the middle, lowest at the beggining and at the end
    float intensity = pow(sin(u_progress * PI), 2.0);

    // -------------------------------------
    // horizontal line glitch
    // divide vertically into 1000 rows
    float blocks = 1000.0;
    float blockId = floor(uv.y * blocks);
    float xOffset = (hash(vec2(blockId, 1.0)) - 0.5) * 0.2 * intensity;
    
    // more intense horizontal glitch
    float fineGrid = 2000.0;
    float fineBlockId = floor(uv.y * fineGrid);
    float fineOffset = (hash(vec2(fineBlockId, 2.0)) - 0.5) * 0.2 * step(0.9, hash(vec2(fineBlockId, u_progress))) * intensity;

    vec2 glitchUv = uv + vec2(xOffset + fineOffset, 0.0);

    // ------------------------------------
    // rgb shift
    float rgbShift = 0.02 * intensity;
    vec4 t1_r = texture2D(u_prevImage, glitchUv + vec2(rgbShift, 0.0));
    vec4 t1_g = texture2D(u_prevImage, glitchUv);
    vec4 t1_b = texture2D(u_prevImage, glitchUv - vec2(rgbShift, 0.0));
    
    vec4 t2_r = texture2D(u_currentImage, glitchUv + vec2(rgbShift, 0.0));
    vec4 t2_g = texture2D(u_currentImage, glitchUv);
    vec4 t2_b = texture2D(u_currentImage, glitchUv - vec2(rgbShift, 0.0));

    vec4 prevColor = vec4(t1_r.r, t1_g.g, t1_b.b, 1.0);
    vec4 currentColor = vec4(t2_r.r, t2_g.g, t2_b.b, 1.0);
    vec4 finalColor = mix(prevColor, currentColor, u_progress);

    // ------------------------------------
    // grain noise
    float grain = hash(v_uv + u_progress) * 0.2 * intensity;
    finalColor.rgb += vec3(grain);

    gl_FragColor = finalColor;
}
