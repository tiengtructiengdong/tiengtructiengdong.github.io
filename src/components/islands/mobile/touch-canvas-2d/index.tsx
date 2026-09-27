/**
 * touch-canvas-2d/index.tsx
 * Lightweight 2D Canvas / Gyroscope handler for mobile.
 * Runs the wave2d fragment shader on a fullscreen quad via raw WebGL.
 *
 * Hydrated client-side only (client:only="react").
 */
import { attachTouch, createTouchState } from "@lib/touch";
import wave2dFrag from "@shaders/mobile/wave2d.frag?raw";
import wave2dVert from "@shaders/mobile/wave2d.vs?raw";
import clsx from "clsx";
import { useEffect, useRef } from "react";

function compile(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Shader allocation failed");
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? "compile error";
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

export interface TouchCanvas2DProps {
  className?: string;
}

export default function TouchCanvas2D({
  className,
}: TouchCanvas2DProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, wave2dVert);
    const fs = compile(gl, gl.FRAGMENT_SHADER, wave2dFrag);
    const program = gl.createProgram();
    if (!program) {
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uTouch = gl.getUniformLocation(program, "uTouch");
    const uTilt = gl.getUniformLocation(program, "uTilt");

    const touchState = createTouchState();
    const dispose = attachTouch(touchState);

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const start = performance.now();
    const render = (): void => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uTouch, touchState.x, canvas.height - touchState.y);
      gl.uniform1f(uTilt, (touchState.gamma + touchState.beta) * 0.01);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    render();

    return (): void => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={clsx("touch-canvas", className)} />;
}
