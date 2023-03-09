import glsl from "vite-plugin-glsl";
export default {
  publicDir: "./static/",
  base: "./",
  server: { host: true },
  plugins: [glsl()],
};
