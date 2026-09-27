// The animated player avatar. Replace /models/noob.glb here to swap the character.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type NoobProps = {
  intro: boolean;
};

export function Noob({ intro }: NoobProps) {
  const { scene } = useGLTF("/models/noob.glb");
  const model = useMemo(() => scene.clone(), [scene]);
  const modelFit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    return {
      scale: 1.8 / Math.max(size.y, 0.001),
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [model]);
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    ref.current.rotation.z = intro
      ? Math.sin(clock.elapsedTime * 7) * 0.12
      : Math.sin(clock.elapsedTime * 5) * 0.018;
    ref.current.position.y = Math.sin(clock.elapsedTime * 3) * 0.025 - 0.85;
  });

  // The GLB's forward axis is rotated 90° from the game's forward axis.
  return (
    <group ref={ref} position={[0, -0.9, 0]} rotation={[0, Math.PI / 2, 0]} scale={modelFit.scale}>
      <primitive object={model} position={modelFit.offset} />
    </group>
  );
}

useGLTF.preload("/models/noob.glb");
