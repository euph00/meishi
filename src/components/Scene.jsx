import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Cloud } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
function TwinklingStars({ count = 5000 }) {
    const { positions, colors, randoms, boosts } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        const rnd = new Float32Array(count);
        const bst = new Float32Array(count);
        const palette = [
            new THREE.Color('#f39800'),
            new THREE.Color('#e30f25'),
            new THREE.Color('#0c7bbb'),
            new THREE.Color('#f8c112'),
            new THREE.Color('#7f1184'),
            new THREE.Color('#eafdff'),
            new THREE.Color('#f68b1f'),
            new THREE.Color('#7cfc00'),
            new THREE.Color('#00afcc'),
            new THREE.Color('#f6adc6'),
            new THREE.Color('#ea533a'),
            new THREE.Color('#7a99cf'),
            new THREE.Color('#f6ae54'),
            new THREE.Color('#7b68ee'),
        ];

        for (let i = 0; i < count; i++) {
            // Positions
            const r = 100;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            // Colors and Boosts
            let color;
            let boost;
            let randomVal;

            if (Math.random() > 0.95) { // 5% chance of being colored
                color = palette[Math.floor(Math.random() * palette.length)];
                boost = 1.3; // 1.3x size and brightness
                randomVal = 0.8 + Math.random() * 0.2; // Force large base size (0.8-1.0)
            } else {
                color = new THREE.Color('#ffffff'); // Mostly white
                boost = 1.0; // Normal
                randomVal = Math.random(); // Full range size
            }

            rnd[i] = randomVal;
            cols[i * 3] = color.r;
            cols[i * 3 + 1] = color.g;
            cols[i * 3 + 2] = color.b;
            bst[i] = boost;
        }
        return { positions: pos, colors: cols, randoms: rnd, boosts: bst };
    }, [count]);

    const shaderArgs = useMemo(
        () => ({
            uniforms: {
                uTime: { value: 0 },
            },
            vertexShader: `
        attribute float aRandom;
        attribute vec3 aColor;
        attribute float aBoost;
        varying float vRandom;
        varying vec3 vColor;
        varying float vBoost;
        void main() {
          vRandom = aRandom;
          vColor = aColor;
          vBoost = aBoost;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          // Base size * Boost
          gl_PointSize = (4.0 + aRandom * 6.0) * (100.0 / -mvPosition.z) * aBoost;
        }
      `,
            fragmentShader: `
        uniform float uTime;
        varying float vRandom;
        varying vec3 vColor;
        varying float vBoost;
        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          
          // Astroid shape (concave diamond) for 4-pointed star look
          // Formula: |x|^0.5 + |y|^0.5 = r
          float d = sqrt(abs(uv.x)) + sqrt(abs(uv.y));
          
          // Soft edge around the shape (approx 0.7 is the tip of the star at 0.5 radius)
          float alpha = 1.0 - smoothstep(0.6, 0.8, d);
          
          if (alpha <= 0.0) discard;
          
          float twinkle;
          if (vBoost > 1.1) {
             // Colored stars: Normal speed, but stay bright longer (broad peak)
             float t = 0.5 + 0.5 * sin(uTime * 1.0 + vRandom * 10.0);
             twinkle = pow(t, 0.5); // Broaden the curve so it stays close to 1.0 longer
          } else {
             // Normal stars: Standard sine wave
             twinkle = 0.5 + 0.5 * sin(uTime * (1.0 + vRandom) + vRandom * 10.0);
          }

          // Apply boost to intensity
          gl_FragColor = vec4(vColor * vBoost, alpha * twinkle * vRandom);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        }),
        []
    );

    const points = useRef();

    useFrame((state) => {
        if (points.current) {
            points.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
            points.current.rotation.y += 0.0001; // Slow rotation
        }
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aRandom"
                    count={count}
                    array={randoms}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-aColor"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-aBoost"
                    count={count}
                    array={boosts}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial attach="material" args={[shaderArgs]} />
        </points>
    );
}
function CameraRig() {
    useFrame((state) => {
        // Subtle camera movement based on mouse
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.5, 0.05);
    });
    return null;
}
import styles from './Scene.module.css';
const Scene = () => {
    return (
        <div className={styles.container}>
            <Canvas camera={{ position: [0, 0, 1] }}>
                <TwinklingStars />
                {/* <Sparkles count={300} scale={10} size={4} speed={0.4} opacity={0.8} color="#6366f1" /> */}
                {/* <Sparkles count={150} scale={15} size={6} speed={0.2} opacity={0.6} color="#a855f7" /> */}
                <Cloud opacity={0.1} speed={0.2} width={10} depth={1.5} segments={20} position={[0, 0, -10]} color="#1e1b4b" />
                <CameraRig />
            </Canvas>
            <div className={styles.overlay}></div>
        </div>
    );
};
export default Scene;