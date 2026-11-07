import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneModelData, Vector3Tuple } from "../../types/world";
import { getKtx2Loader } from "./sceneModelLoader";

type SceneModelProps = SceneModelData & {
  position: Vector3Tuple;
  anchor?: "bottom" | "top";
};

export function SceneModel({
  url,
  position,
  displaySize,
  rotation,
  anchor = "bottom",
}: SceneModelProps) {
  const { gl } = useThree();
  // Some GLB assets (such as the tree) use KTX2-compressed textures.
  // Keep the decoder local so models work offline and in production builds.
  const ktx2Loader = useMemo(() => getKtx2Loader(gl), [gl]);
  const { scene } = useGLTF(url, true, true, (loader) =>
    loader.setKTX2Loader(ktx2Loader),
  );
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
