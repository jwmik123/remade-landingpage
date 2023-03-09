uniform sampler2D uTexture;
uniform float uRefractionRatio;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 distortedPosition = vec2(uv.x, uv.y + sin(uv.y * 20.0) * 0.02);
  vec4 color = texture2D(uTexture, distortedPosition);

  vec2 position = (uv - vec2(0.5)) * 2.0;
  float theta = atan(position.y, position.x);
  float radius = length(position);

  vec2 distortion = vec2(
    cos(theta) * sin(radius * uRefractionRatio),
    sin(theta) * sin(radius * uRefractionRatio)
  );

  vec4 finalColor = texture2D(uTexture, distortedPosition + distortion);

  gl_FragColor = finalColor;
}