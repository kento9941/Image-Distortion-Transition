uniform sampler2D u_currentImage;
uniform sampler2D u_prevImage;
uniform sampler2D u_displacement;
uniform float u_progress;
uniform vec2 u_uvScale;
varying vec2 v_uv;

// constants
const float PI = 3.1415;
const float angle1 = - PI * 0.25;
const float angle2 = PI * 0.75;

// rotation matrix
mat2 getRotM(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = (v_uv - 0.5) * u_uvScale + 0.5;

    vec4 disp = texture2D(u_displacement, uv);
    vec2 dispVec = vec2(disp.r, disp.g);

    vec2 currentUv = uv + getRotM(angle1) * dispVec * 0.5 * (1.0 - u_progress);
    vec4 currentImage = texture2D(u_currentImage, currentUv);

    vec2 prevUv = uv + getRotM(angle2) * dispVec * 0.5 * u_progress;
    vec4 prevImage = texture2D(u_prevImage, prevUv);

    gl_FragColor = mix(prevImage, currentImage, u_progress);
}
