export type Vector3Tuple = [number, number, number];

export type PlatformData = {
  id?: string;
  position: Vector3Tuple;
  size: Vector3Tuple;
  color: string;
  /** Visual-only platforms are rendered but the player falls through them. */
  collidable?: boolean;
  /** Draws this platform as a suspended rope instead of a block. */
  rope?: { start: Vector3Tuple; end: Vector3Tuple };
  /** Flat text decals for platform guidance. */
  floorText?: Array<{ text: string; position: Vector3Tuple }>;
  surface?: "grass" | "flowers" | "baseplate" | "stone" | "bridge" | "butter" | "floating-stone";
  /** Makes a grass surface use the denser meadow decoration. */
  gardenDensity?: "lush";
  section?: number;
  /** Optional colour for the checkpoint ring; defaults to the platform colour. */
  markerColor?: string;
  /** Adds a decorative finish-line gantry to this platform. */
  finishGate?: boolean;
  model?: SceneModelData;
  modelLabelOffset?: Vector3Tuple;
  /** Decorative models placed directly on this platform. */
  scenery?: Array<SceneModelData & { position: Vector3Tuple; anchor?: "bottom" | "top" }>;
  quoteBoard?: {
    quote: string;
    author: string;
    /** Fine-tune this individual board's [right/left, up/down, forward/back] placement. */
    positionOffset?: Vector3Tuple;
    /** Fine-tune this individual board's [x, y, z] rotation in radians. */
    rotation?: Vector3Tuple;
  };
};

export type SceneModelData = {
  url: string;
  displaySize: number;
  rotation?: Vector3Tuple;
};
