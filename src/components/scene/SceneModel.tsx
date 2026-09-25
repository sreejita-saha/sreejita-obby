import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { SceneModelData, Vector3Tuple } from "../../types/world";

type SceneModelProps = SceneModelData & {
  position: Vector3Tuple;
  anchor?: "bottom" | "top";
};

export function SceneModel({ url, position, displaySize, rotation, anchor = "bottom" }: SceneModelProps) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => scene.clone(), [scene]);
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const largestDimension = Math.max(size.x, size.y, size.z, 0.001);

    return {
      scale: displaySize / largestDimension,
      offset: new THREE.Vector3(
        -center.x,
        anchor === "top" ? -box.max.y : -box.min.y,
        -center.z,
      ),
    };
  }, [anchor, displaySize, model]);

  return (
    <group position={position} rotation={rotation} scale={fit.scale}>
      <primitive object={model} position={fit.offset} />
    </group>
  );
}
