export type Vector3Tuple = [number, number, number];

export type PlatformData = {
  position: Vector3Tuple;
  size: Vector3Tuple;
  color: string;
  section?: number;
  model?: SceneModelData;
};

export type SceneModelData = {
  url: string;
  displaySize: number;
  rotation?: Vector3Tuple;
};
