<template>
  <div id="accelerate"></div>
</template>
<script setup lang="ts">
  import { gsap } from 'gsap';
  import * as THREE from 'three';
  import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
  import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
  import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
  import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';

  onMounted(() => {
    const scene = new THREE.Scene();

    let isFastened = false;

    const atmosphereVertexShader = `
  varying vec2 vUv;
  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
    const atmosphereFragmentShader = () => `
  varying vec2 vUv;
  void main () {
    float distance = length(vUv - vec2(0.5, 0.5));
    float alpha = smoothstep(10.0, 0.0, distance);
    gl_FragColor = vec4(${Math.random().toFixed(2)}, 0.45, 0.81, alpha);
  }
`;

    // points
    const addPoint = (position: [number, number, number]) => {
      const atmosPhereGeometry = new THREE.SphereGeometry(
        Math.random() / 120,
        8,
        8
      );
      const atmosphere = new THREE.Mesh(
        atmosPhereGeometry,
        new THREE.ShaderMaterial({
          vertexShader: atmosphereVertexShader,
          fragmentShader: atmosphereFragmentShader(),
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthTest: false,
        })
      );
      atmosphere.position.set(...position);
      scene.add(atmosphere);
    };
    const count = 1000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 6;
    }

    for (let i = 0; i < count; i++) {
      addPoint([positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]);
    }

    // light
    const light = new THREE.RectAreaLight(0xffffff, 1, 3, 3);
    light.position.set(0, 0, 3);
    scene.add(light);

    // camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.z = 3;
    scene.add(camera);

    // renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setClearAlpha(0.0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    renderer.setClearColor(
      new THREE.Color('#230d32').lerp(new THREE.Color('#000'), 0.5),
      0.5
    );
    document.querySelector('#accelerate')!.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.setSize(window.innerWidth, window.innerHeight);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.0,
      1.0,
      0.18
    );
    bloomPass.renderToScreen = true;
    const copyPass = new ShaderPass(CopyShader);
    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(copyPass);
    const accelerateSpeed = {
      value: 0.001,
    };
    let toggleEnabled = true;
    window.addEventListener('keypress', (evt) => {
      if (evt.code === 'Space' && toggleEnabled) {
        toggleEnabled = false;
        isFastened = !isFastened;
        if (isFastened) {
          gsap.to(bloomPass, {
            duration: 0.2,
            strength: 0.6,
            radius: 0.8,
          });
          gsap.to(accelerateSpeed, {
            duration: 2,
            value: 0.2,
          });
        } else {
          gsap.to(bloomPass, {
            strength: 1.0,
            radius: 1.0,
            duration: 0.5,
            delay: 0.5,
          });
          gsap.to(accelerateSpeed, {
            duration: 2,
            value: 0.001,
          });
        }
        scene.children.forEach((obj) => {
          if (obj.type === 'Mesh') {
            if (isFastened) {
              gsap.to(obj.scale, {
                x: 0.5,
                y: 0.5,
                z: 150,
                duration: 1.8,
                delay: 0.2,
              });
            } else {
              gsap.to(obj.scale, {
                duration: 1,
                x: 1,
                y: 1,
                z: 1,
              });
            }
          }
        });
        setTimeout(() => (toggleEnabled = true), 2000);
      }
    });

    const render = () => {
      requestAnimationFrame(render);
      scene.children.forEach((obj) => {
        if (obj.type === 'Mesh') {
          obj.position.z += accelerateSpeed.value;
          if (obj.position.z >= 3) {
            obj.position.z = -1;
            obj.position.x = (Math.random() - 0.5) * 6;
            obj.position.z = (Math.random() - 0.5) * 6;
          }
        }
      });
      composer.render();
    };

    render();
  });
</script>
