precision mediump float;

varying vec2 v_texCoord;

uniform sampler2D u_image;
uniform vec2 u_resolution;
uniform vec2 u_faceCenter;  // midpoint between both eyes
uniform float u_faceRadius; // radius covering the face area
uniform float u_blurAmount;
uniform float u_fadeRange;
uniform vec2 u_direction; // (1,0) for horizontal, (0,1) for vertical
uniform float u_lensActive; // 0.0 = before (face clear, rest blurred), 1.0 = after (all clear)

void main() {
    vec2 uv = v_texCoord;
    vec2 onePixel = u_direction / u_resolution;

    // Aspect-corrected distance so the clear zone is circular on screen
    float aspect = u_resolution.x / u_resolution.y;
    vec2 adjustedUV = vec2(uv.x * aspect, uv.y);
    vec2 adjustedCenter = vec2(u_faceCenter.x * aspect, u_faceCenter.y);
    float dist = distance(adjustedUV, adjustedCenter);

    // Before wearing lens (lensActive=0):
    //   Near face center → clear, far from face → blurred
    // After wearing lens (lensActive=1):
    //   Everywhere clear
    float distanceFactor = smoothstep(u_faceRadius, u_faceRadius + u_fadeRange, dist);
    float blurStrength = distanceFactor * (1.0 - u_lensActive) * u_blurAmount;

    // Early exit if no blur needed
    if (blurStrength < 0.01) {
        gl_FragColor = texture2D(u_image, uv);
        return;
    }

    // Gaussian blur sampling (9-tap)
    vec4 color = vec4(0.0);
    float weights[5];
    weights[0] = 0.227027;
    weights[1] = 0.194596;
    weights[2] = 0.121622;
    weights[3] = 0.054054;
    weights[4] = 0.016216;

    color += texture2D(u_image, uv) * weights[0];

    for (int i = 1; i < 5; i++) {
        vec2 offset = onePixel * float(i) * blurStrength;
        color += texture2D(u_image, uv + offset) * weights[i];
        color += texture2D(u_image, uv - offset) * weights[i];
    }

    gl_FragColor = color;
}
