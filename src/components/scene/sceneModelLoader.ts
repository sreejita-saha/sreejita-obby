import { useGLTF } from "@react-three/drei";
import { KTX2Loader } from "three-stdlib";
import type * as THREE from "three";

const ktx2Loaders = new WeakMap<THREE.WebGLRenderer, KTX2Loader>();

export function getKtx2Loader(gl: THREE.WebGLRenderer) {
  let loader = ktx2Loaders.get(gl);
  if (!loader) {
    loader = new KTX2Loader().setTranscoderPath("/basis/").detectSupport(gl);
    ktx2Loaders.set(gl, loader);
  }
  return loader;
}

/** Warm the GLTF cache for models in an upcoming checkpoint. */
export function preloadSceneModels(urls: Iterable<string>, gl: THREE.WebGLRenderer) {
  const ktx2Loader = getKtx2Loader(gl);
  for (const url of new Set(urls)) {
    useGLTF.preload(url, true, true, (loader) => loader.setKTX2Loader(ktx2Loader));
  }
}
