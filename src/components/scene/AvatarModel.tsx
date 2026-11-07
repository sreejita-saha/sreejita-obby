// Roblox avatar exported in public/models/me.
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-stdlib";

type AvatarModelProps = {
  showChatBubble: boolean;
};

export function AvatarModel({ showChatBubble }: AvatarModelProps) {
  const materials = useLoader(MTLLoader, "/models/me/sreejita.mtl");
  const source = useLoader(OBJLoader, "/models/me/sreejita.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });
  const model = useMemo(() => {
    const avatar = source.clone();
    // Roblox's exported MTL uses overlay alpha maps for several body textures.
    // In Three.js that makes the entire avatar read as ghosted, so retain the
    // colour map but force all avatar materials back to fully opaque.
    avatar.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const importedMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      // Roblox exports its face as a transparent overlay texture. Base maps
      // must be untinted, while that single overlay keeps its alpha channel.
      const opaqueMaterials = importedMaterials.map((material) => {
        if (material.map) material.map.colorSpace = THREE.SRGBColorSpace;
        // This export calls its alpha-only facial decal Rig4Mtl. It must stay
        // transparent so the skin-toned head behind it remains visible.
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
        ? opaqueMaterials
        : opaqueMaterials[0];
    });
    return avatar;
  }, [source]);
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 1.69 / Math.max(size.x, size.y, size.z, 0.001);

    return {
      scale,
      offset: new THREE.Vector3(-center.x, -box.min.y, -center.z),
    };
  }, [model]);

  return (
    <group position={[-2.5, 0, 0.8]} rotation={[0, Math.PI + 0.7, 0]} scale={fit.scale}>
      {showChatBubble && <Html
        position={[0, 6.9, -0.3]}
        center
        distanceFactor={6}
      >
        <div className="avatar-speech-bubble">
          <p>Heyy, I’m Sreejita!<br />Come explore my little world :D</p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("obby-open-ai-chat"))}
          >
            Talk to me
          </button>
        </div>
      </Html>}
      {/* Roblox exports the face decal as an alpha-only head mesh. Supply the
          missing opaque head beneath it so the eyes and mouth have skin behind. */}
      <mesh position={[0, 3.7, -0.3]}>
        <sphereGeometry args={[0.54, 32, 18]} />
        <meshBasicMaterial color="#cb8f66" />
      </mesh>
      <primitive object={model} position={fit.offset} />
    </group>
  );
}
