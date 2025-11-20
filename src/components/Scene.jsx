import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Cloud } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function MovingStars() {
    const starsRef = useRef();
    useFrame((state) => {
        if (starsRef.current) {
            starsRef.current.rotation.y += 0.0002;
            starsRef.current.rotation.x += 0.0001;
        }
    });
    return <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />;
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
                <MovingStars />
                <Sparkles count={200} scale={10} size={2} speed={0.4} opacity={0.5} color="#4f46e5" />
                <Sparkles count={100} scale={15} size={5} speed={0.2} opacity={0.2} color="#a855f7" />
                <Cloud opacity={0.1} speed={0.2} width={10} depth={1.5} segments={20} position={[0, 0, -10]} color="#1e1b4b" />
                <CameraRig />
            </Canvas>
            <div className={styles.overlay}></div>
        </div>
    );
};

export default Scene;

