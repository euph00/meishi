import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Cloud } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
function TwinklingStars({ count = 5000 }) {
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 100;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;
        }
        return pos;
    }, [count]);

    const randoms = useMemo(() => {
        const rnd = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            rnd[i] = Math.random();
        }
        return rnd;
    }, [count]);

    const shaderArgs = useMemo(
        () => ({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#ffffff') },
            },
            vertexShader: `
        attribute float aRandom;
        varying float vRandom;
        void main() {
          vRandom = aRandom;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          // Increased size: base 4.0, random up to +6.0, distance scale 100.0
          gl_PointSize = (4.0 + aRandom * 6.0) * (100.0 / -mvPosition.z);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying float vRandom;
        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          
          // Astroid shape (concave diamond) for 4-pointed star look
          // Formula: |x|^0.5 + |y|^0.5 = r
          float d = sqrt(abs(uv.x)) + sqrt(abs(uv.y));
          
          // Soft edge around the shape (approx 0.7 is the tip of the star at 0.5 radius)
          float alpha = 1.0 - smoothstep(0.6, 0.8, d);
          
          if (alpha <= 0.0) discard;
          
          float twinkle = 0.5 + 0.5 * sin(uTime * (1.0 + vRandom) + vRandom * 10.0);
          gl_FragColor = vec4(uColor, alpha * twinkle * vRandom);
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
                <Sparkles count={300} scale={10} size={4} speed={0.4} opacity={0.8} color="#6366f1" />
                <Sparkles count={150} scale={15} size={6} speed={0.2} opacity={0.6} color="#a855f7" />
                <Cloud opacity={0.1} speed={0.2} width={10} depth={1.5} segments={20} position={[0, 0, -10]} color="#1e1b4b" />
                <CameraRig />
            </Canvas>
            <div className={styles.overlay}></div>
        </div>
    );
};
export default Scene;