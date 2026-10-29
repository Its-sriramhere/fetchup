"use client";

// Reduced OGL adaptation of the React Bits Aurora noise/ramp technique.
// FetchUp uses one low-resolution layer, a fixed violet palette and no pointer input.
import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const vertex = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;

const fragment = `#version 300 es
precision highp float;
uniform float uTime;
in vec2 vUv;
out vec4 fragColor;
vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=x0.x>x0.y?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m;m=m*m;vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;
  vec3 ox=floor(x+.5);vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
void main(){
  vec2 uv=vUv;
  float wave=snoise(vec2(uv.x*1.8+uTime*.018,uTime*.025))*.16;
  float band=exp(-pow((uv.y-.52-wave)*3.,2.));
  float side=smoothstep(.28,.85,uv.x)*(1.-smoothstep(.86,1.3,uv.x));
  float alpha=band*side*.26;
  fragColor=vec4(vec3(.4392,.1255,.9608)*alpha,alpha);
}`;

export default function Aurora() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let renderer: Renderer;
    try { renderer = new Renderer({ alpha: true, antialias: false, dpr: .65, webgl: 2 }); } catch { return; }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    let program: Program;
    let geometry: Triangle;
    try {
      geometry = new Triangle(gl);
      program = new Program(gl, { vertex, fragment, uniforms: { uTime: { value: 0 } }, transparent: true, depthTest: false, depthWrite: false });
    } catch { gl.getExtension("WEBGL_lose_context")?.loseContext(); return; }
    const mesh = new Mesh(gl, { geometry, program });
    container.appendChild(gl.canvas);
    let frame = 0;
    let visible = true;
    let elapsed = 0;
    let previous = 0;
    const render = (time: number) => {
      frame = 0;
      if (!visible || document.hidden) { previous = 0; return; }
      elapsed += previous ? Math.min((time - previous) / 1000, .05) : 0;
      previous = time;
      program.uniforms.uTime.value = elapsed;
      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(render);
    };
    const wake = () => { if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render); };
    const resize = () => { renderer.setSize(Math.min(container.clientWidth, 1440), container.clientHeight); wake(); };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const intersection = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); wake(); });
    intersection.observe(container);
    document.addEventListener("visibilitychange", wake);
    resize();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); document.removeEventListener("visibilitychange", wake);
      geometry.remove(); program.remove(); gl.canvas.remove(); gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);
  return <div className="aurora-canvas" ref={ref} />;
}
