import { ShaderMaterial } from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

export default class RefractionMaterial extends ShaderMaterial {
  constructor(options) {
    super({ vertexShader, fragmentShader });

    this.uniforms = {
      envMap: { value: options.envMap },
      resolution: { value: options.resolution },
    };
  }
}
