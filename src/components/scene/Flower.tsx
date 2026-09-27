import * as THREE from "three";
import type { Vector3Tuple } from "../../types/world";

type FlowerProps = {
  position: Vector3Tuple;
  scale?: number;
  petalColor?: string;
};

// These decorations are repeated many times. Reusing their GPU resources
// avoids allocating identical geometry and material for every flower.
const stemGeometry = new THREE.CylinderGeometry(0.035, 0.045, 0.44, 6);
const leafGeometry = new THREE.SphereGeometry(1, 10, 8);
const petalGeometry = new THREE.SphereGeometry(1, 10, 8);
const centreGeometry = new THREE.SphereGeometry(1, 12, 8);
const stemMaterial = new THREE.MeshStandardMaterial({ color: "#4f9c4f", roughness: 0.9 });
const leafMaterial = new THREE.MeshStandardMaterial({ color: "#65b85b", roughness: 0.9 });
const centreMaterial = new THREE.MeshStandardMaterial({ color: "#ffd84d", emissive: "#ffd84d", emissiveIntensity: 0.15 });
const petalMaterials = new Map<string, THREE.MeshStandardMaterial>();

function getPetalMaterial(color: string) {
  let material = petalMaterials.get(color);
  if (!material) {
    material = new THREE.MeshStandardMaterial({ color, roughness: 0.75 });
    petalMaterials.set(color, material);
  }
  return material;
}

/** A small low-poly flower for decorating platforms and islands. */
export function Flower({ position, scale = 1, petalColor = "#fff0f7" }: FlowerProps) {
  const petalMaterial = getPetalMaterial(petalColor);
  const petals = [
    [0, 0.13, 0],
    [0.13, 0, 0],
    [0, -0.13, 0],
    [-0.13, 0, 0],
    [0.09, 0.09, 0],
  ] as const;

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.22, 0]}>
        <primitive attach="geometry" object={stemGeometry} />
        <primitive attach="material" object={stemMaterial} />
      </mesh>
      <mesh position={[0.1, 0.14, 0]} rotation={[0, 0, -0.65]} scale={[0.09, 0.035, 0.04]}>
        <primitive attach="geometry" object={leafGeometry} />
        <primitive attach="material" object={leafMaterial} />
      </mesh>
      <group position={[0, 0.48, 0]}>
        {petals.map(([x, y, z], index) => (
          <mesh key={index} position={[x, y, z]} scale={[0.13, 0.13, 0.06]}>
            <primitive attach="geometry" object={petalGeometry} />
            <primitive attach="material" object={petalMaterial} />
          </mesh>
        ))}
        <mesh scale={[0.095, 0.095, 0.075]}>
          <primitive attach="geometry" object={centreGeometry} />
          <primitive attach="material" object={centreMaterial} />
        </mesh>
      </group>
    </group>
  );
}
