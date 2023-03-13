uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;

// Noise
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float lines(vec2 uv, float offset) {
    return smoothstep(
        0., 0.5 + offset * 0.5,
        abs(0.5*sin(uv.x * 10.) + offset * 2.)
    );
}

mat2 rotate2D(float angle) {
    return mat2(
        cos(angle),-sin(angle),
        sin(angle),cos(angle)
    );
}

void main() {
    float n = noise(vPosition + uTime);

    // Random
    vec3 accent = vec3(77./255.,69./255.,93./255.);
    vec3 color2 = vec3(245./255.,233./255.,207./255.);
    vec3 color1 = vec3(125./255.,185./255.,182./255.);

    // Pattern creation
    vec2 baseUV = rotate2D(n)*vPosition.xy*0.2;
    float basePattern = lines(baseUV, 0.5);
    float secondPattern = lines(baseUV, 0.1);

    // Mixing colors
    vec3 baseColor = mix(color1, accent, basePattern);
    vec3 secondBaseColor = mix(baseColor, color2, secondPattern);

    gl_FragColor = vec4(vec3(secondBaseColor), 1.);
}