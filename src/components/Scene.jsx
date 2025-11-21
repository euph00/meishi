import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Cloud } from '@react-three/drei';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import styles from './Scene.module.css';
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
            // Volumetric distribution: Random radius between 50 and 150
            const r = 50 + Math.random() * 100;
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
                boost = 3.0; // High brightness boost
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
        uniform float uTime;

        void main() {
          vRandom = aRandom;
          vColor = aColor;
          vBoost = aBoost;
          
          vec3 pos = position;
          
          // Differential Rotation (Parallax Effect)
          // Calculate distance from center (radius)
          float dist = length(pos);
          
          // Stars closer to the center rotate faster
          // Base speed + variable speed based on inverse distance
          // Randomized speed factor (0.8 to 1.2) to break lockstep
          // Increased speed slightly (0.02) and reversed direction
          float speed = (0.02 + (100.0 / dist) * 0.02) * (0.8 + aRandom * 0.4);
          
          // Calculate rotation angle
          // Negative for Right-to-Left movement
          float angle = -uTime * speed * 0.5;
          
          // Rotate around Y axis
          float s = sin(angle);
          float c = cos(angle);
          
          // Apply rotation matrix to X and Z
          float nx = pos.x * c - pos.z * s;
          float nz = pos.x * s + pos.z * c;
          
          pos.x = nx;
          pos.z = nz;

          // Vertical Wobble
          // Add a gentle sine wave movement to Y to break linearity
          // Amplitude varies by star (0.5 to 1.0) - Reduced to be subtle
          pos.y += sin(uTime * 0.5 + aRandom * 10.0) * (0.5 + aRandom * 0.5);

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Base size only (removed boost multiplier for size)
          gl_PointSize = (4.0 + aRandom * 6.0) * (100.0 / -mvPosition.z);
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
                float d = sqrt(abs(uv.x)) + sqrt(abs(uv.y));
                float alpha = 1.0 - smoothstep(0.6, 0.8, d);

                if(alpha <= 0.0) discard;
          
                float twinkle;
                float opacityMult;
          
                if (vBoost > 1.1) {
                    // Colored stars: Normal speed, but stay bright longer (broad peak)
                    float t = 0.5 + 0.5 * sin(uTime * 1.0 + vRandom * 10.0);
                    twinkle = pow(t, 0.5); // Broaden the curve so it stays close to 1.0 longer
                    opacityMult = 1.0; // No random dimming for colored stars
                } else {
                    // Normal stars: Standard sine wave
                    twinkle = 0.5 + 0.5 * sin(uTime * (1.0 + vRandom) + vRandom * 10.0);
                    opacityMult = vRandom; // Random dimming for white stars
                }

                // Apply boost to intensity
                gl_FragColor = vec4(vColor * vBoost, alpha * twinkle * opacityMult);
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
            // Removed CPU-side rotation to allow shader to handle differential rotation
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

function ShootingStars() {
    // Create a few shooting stars with different timings/positions
    const stars = useMemo(() => {
        return Array.from({ length: 3 }).map((_, i) => ({
            id: i,
            speed: 10 + Math.random() * 20,
            offset: Math.random() * 100,
            position: [
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 50,
                -20 - Math.random() * 30
            ]
        }));
    }, []);

    return (
        <>
            {stars.map((star) => (
                <SingleShootingStar key={star.id} {...star} />
            ))}
        </>
    );
}

function SingleShootingStar({ speed, offset, position }) {
    const ref = useRef();
    const [active, setActive] = useState(false);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Trigger every 5-15 seconds randomly
        if (!active && Math.random() < 0.002) {
            setActive(true);
            if (ref.current) {
                ref.current.position.set(
                    (Math.random() - 0.5) * 100,
                    20 + Math.random() * 10,
                    -30
                );
            }
        }

        if (active && ref.current) {
            ref.current.position.x -= speed * 0.02;
            ref.current.position.y -= speed * 0.01;

            // Reset when out of view
            if (ref.current.position.y < -30) {
                setActive(false);
            }
        }
    });

    // Calculate exact rotation based on movement vector (-0.02, -0.01)
    const angle = Math.atan2(-0.01, -0.02);

    return (
        <mesh ref={ref} visible={active} rotation={[0, 0, angle]}>
            <planeGeometry args={[5, 0.1]} />
            <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={active ? 0.8 : 0}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}


function Nebula() {
    const shaderArgs = useMemo(
        () => ({
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color('#1e1b4b') }, // Deep Indigo
                uColor2: { value: new THREE.Color('#4c1d95') }, // Deep Purple
                uColor3: { value: new THREE.Color('#0c7bbb') }, // Blue
            },
            vertexShader: `
        varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform vec3 uColor3;
        varying vec2 vUv;

        // Simplex 2D noise
        vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
        float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
        -0.577350269189626, 0.024390243902439);
          vec2 i = floor(v + dot(v, C.yy));
          vec2 x0 = v - i + dot(i, C.xx);
          vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
          vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0));
          vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
          vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
          // Explicit Scroll Vectors
          // Layer 1: Main shape, moves right-to-left
          // Increased speed slightly (0.01 -> 0.015)
          vec2 scroll1 = vec2(uTime * 0.015, uTime * 0.003);
          
          // Layer 2: Details, moves slightly faster and opposite vertical drift for turbulence
          // Increased speed slightly (0.015 -> 0.022)
          vec2 scroll2 = vec2(uTime * 0.022, -uTime * 0.004);
          
          // Generate noise layers with explicit scrolling
          float n1 = snoise(vUv * 3.0 + scroll1);
          float n2 = snoise(vUv * 6.0 + scroll2);
          
          // Combine noise
          float noise = n1 * 0.6 + n2 * 0.4;
    noise = noise * 0.5 + 0.5; // Normalize to 0-1

          // Soften the noise for diffused clouds
          // Full range (0.0 to 1.0) for maximum diffusion and softness
          float softNoise = smoothstep(0.0, 1.0, noise);

          // Shimmer Effect
          // Create a high-frequency sine wave based on time and position
          float shimmer = sin(uTime * 2.0 + vUv.x * 10.0 + vUv.y * 10.0) * 0.5 + 0.5;
    // Mix it with noise so it's not uniform
    shimmer = mix(0.8, 1.2, shimmer * noise);

          // Color mixing with softer gradients
          vec3 color = mix(uColor1, uColor2, smoothstep(0.1, 0.9, noise));
    color = mix(color, uColor3, smoothstep(0.2, 1.0, n2 * 0.5 + 0.5));

    // Apply shimmer to color brightness
    color *= shimmer;

          // Vignette
          float dist = distance(vUv, vec2(0.5));
          // Relaxed vignette: starts fading much further out (at 0.6) and ends at 1.2
          // This keeps the edges of the screen bright
          float vignette = smoothstep(1.2, 0.6, dist);

          // Use softNoise for alpha
          // Increased opacity to 0.9 for stronger presence
          float alpha = softNoise * vignette * 0.9;

    gl_FragColor = vec4(color, alpha);
}
`,
            transparent: true,
            depthWrite: false,
        }),
        []
    );

    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <mesh position={[0, 0, -25]}>
            <planeGeometry args={[100, 100]} />
            <shaderMaterial ref={ref} args={[shaderArgs]} />
        </mesh>
    );
}

const Scene = () => {
    return (
        <div className={styles.container}>
            <Canvas camera={{ position: [0, 0, 1] }}>
                <TwinklingStars />
                <ShootingStars />
                <Nebula />
                <CameraRig />
            </Canvas>
            <div className={styles.overlay}></div>
        </div>
    );
};
export default Scene;