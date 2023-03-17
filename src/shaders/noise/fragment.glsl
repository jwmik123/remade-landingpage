uniform float uTime;
uniform float uAmount;

float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float noise = rand(gl_FragCoord.xy);
  noise = mix(-1.0, 1.0, noise);
  float timeFactor = abs(sin(uTime));
  gl_FragColor = vec4(vec3(noise * uAmount * timeFactor), 1.0);
}
