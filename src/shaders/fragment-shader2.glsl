uniform sampler2D u_currentImage;
uniform sampler2D u_prevImage;
uniform sampler2D u_displacement;
uniform float u_progress;
uniform vec2 u_uvScale;
varying vec2 v_uv;

const float PI = 3.1415926535;

// fourier wave
float fourierWave(vec2 p, float offset) {
    float wave = 0.0;
    wave += sin(p.x * 10.0 + offset) * 0.5;                     // low freq
    wave += sin(p.y * 20.0 + offset * 1.5) * 0.25;              // mid freq
    wave += sin((p.x + p.y) * 40.0 + offset * 2.0) * 0.125;     // high freq
    wave += sin(length(p) * 60.0 - offset) * 0.0625;            // radient
    return wave;
}

void main() {
    vec2 uv = (v_uv - 0.5) * u_uvScale + 0.5;
    
    float noise = texture2D(u_displacement, uv).r;

    float wave = fourierWave(uv, u_progress * 10.0);
    
    vec2 distortion = vec2(wave) * noise * 0.5;

    // previous image
    vec2 prevUv = uv + distortion * u_progress;
    vec4 prevImage = texture2D(u_prevImage, prevUv);

    // current image
    vec2 currentUv = uv - distortion * (1.0 - u_progress);
    vec4 currentImage = texture2D(u_currentImage, currentUv);

    // apply highlights to the wave peaks
    float highlight = smoothstep(0.0, 0.1, wave * u_progress * (1.0 - u_progress));

    vec4 color = mix(prevImage, currentImage, u_progress);
    gl_FragColor = color + highlight * 0.05;
}