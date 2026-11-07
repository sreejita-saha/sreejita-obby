// Loads the Roblox OBJ avatar and applies its export-specific material fixes.
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-stdlib";
import { AvatarSpeechBubble } from "../avatar/AvatarSpeechBubble";

type AvatarModelProps = {
  /** Hide interactive UI whenever an app-level modal is open. */
  showChatBubble: boolean;
};

const AVATAR_POSITION: [number, number, number] = [-2.5, 0, 0.8];
const AVATAR_ROTATION: [number, number, number] = [0, Math.PI + 0.7, 0];
const DISPLAY_SIZE = 1.69;

function useAvatarModel() {
  const materials = useLoader(MTLLoader, "/models/me/sreejita.mtl");
  const source = useLoader(OBJLoader, "/models/me/sreejita.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  return useMemo(() => {
    const avatar = source.clone();
    avatar.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const imported = Array.isArray(object.material)
        ? object.material
        : [object.material];

      const nextMaterials = imported.map((material) => {
        if (material.map) material.map.colorSpace = THREE.SRGBColorSpace;
        const isFaceOverlay = material.name === "Rig4Mtl";
        return new THREE.MeshBasicMaterial({
          color: "#ffffff",
          map: material.map,
          side: material.side,
          transparent: isFaceOverlay,
          opacity: 1,
          alphaTest: isFaceOverlay ? 0.08 : 0,
          depthWrite: !isFaceOverlay,
        });
      });

      object.material = Array.isArray(object.material)
        ? nextMaterials
        : nextMaterials[0];
    });
    return avatar;
  }, [source]);
}

export function AvatarModel({ showChatBubble }: AvatarModelProps) {
  const model = useAvatarModel();
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = DISPLAY_SIZE / Math.max(size.x, size.y, size.z, 0.001);

    return {
      scale,
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [model]);

  return (
    <group position={AVATAR_POSITION} rotation={AVATAR_ROTATION} scale={fit.scale}>
      {showChatBubble && <AvatarSpeechBubble />}
      {/* The Roblox face decal needs a solid head behind its transparent pixels. */}
      <mesh position={[0, 3.7, -0.3]}>
        <sphereGeometry args={[0.54, 32, 18]} />
        <meshBasicMaterial color="#cb8f66" />
      </mesh>
      <primitive object={model} position={fit.offset} />
    </group>
  );
}
