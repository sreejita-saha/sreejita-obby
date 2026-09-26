export type Vector3Tuple = [number, number, number];

export type PlatformData = {
  position: Vector3Tuple;
  size: Vector3Tuple;
  color: string;
  surface?: "grass" | "flowers" | "baseplate" | "stone";
  section?: number;
  model?: SceneModelData;
  modelLabelOffset?: Vector3Tuple;
};

export type SceneModelData = {
  url: string;
  displaySize: number;
  rotation?: Vector3Tuple;
};
