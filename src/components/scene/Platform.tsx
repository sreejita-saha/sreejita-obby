// Converts one PlatformData record into its 3D platform, scenery, and checkpoint UI.
import { Float, Html, Instance, Instances, RoundedBox, Text } from "@react-three/drei";
import * as THREE from "three";
import { portfolio } from "../../data/portfolio";
import type { PlatformData } from "../../types/world";
import { Flower } from "./Flower";
import { SceneModel } from "./SceneModel";
import { QuoteBoard } from "./QuoteBoard";
import { CheckpointFlag } from "./CheckpointFlag";
import { ButterBlock } from "./ButterBlock";

type PlatformProps = {
  data: PlatformData;
  showLabel: boolean;
  onOpenCheckpoint?: () => void;
};

const CHECKPOINT_FLAG_COLORS = [
  "#ff6f91",
  "#6fa8ff",
  "#b991ff",
  "#ff9c4a",
  "#55d6be",
  "#ffd84d",
];

export function Platform({ data, showLabel, onOpenCheckpoint }: PlatformProps) {
  const section = data.section === undefined ? undefined : portfolio[data.section];
  const labelSide = data.section !== undefined && data.section % 2 === 0 ? -1 : 1;
  const [width, height, depth] = data.size;
  const [x, y, z] = data.position;
  const top = y + height / 2;
  const labelX = x + labelSide * (width / 2 + 1.5);
  const flagColor =
    data.section === undefined
      ? data.color
      : CHECKPOINT_FLAG_COLORS[data.section % CHECKPOINT_FLAG_COLORS.length];
  const [modelOffsetX, modelOffsetY, modelOffsetZ] = data.modelLabelOffset ?? [
    0, 0.25, 0,
  ];
  const [boardOffsetX, boardOffsetY, boardOffsetZ] = data.quoteBoard?.positionOffset ?? [
    0, 0, 0,
  ];

  return (
    <group>
      {data.rope ? (
        <RopeBridge start={data.rope.start} end={data.rope.end} />
      ) : data.surface === "baseplate" ? (
        <RobloxBaseplate position={data.position} size={data.size} color={data.color} />
      ) : data.surface === "bridge" ? (
        <WoodBridge position={data.position} size={data.size} />
      ) : data.surface === "butter" ? (
        <ButterBlock position={data.position} size={data.size} color={data.color} />
      ) : data.surface === "floating-stone" ? (
        <FloatingStoneIsland
          position={data.position}
          size={data.size}
          seed={data.id ?? `${x}-${z}`}
        />
      ) : (
        <>
          <RoundedBox
            args={data.size}
            radius={0.16}
            smoothness={4}
            position={data.position}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial
              color={data.color}
              emissive={data.color}
              emissiveIntensity={0.1}
              roughness={0.68}
            />
          </RoundedBox>
          {!data.rope && (
            <mesh position={[x, top + 0.025, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[width * 0.82, depth * 0.82]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.045} />
            </mesh>
          )}
        </>
      )}
      {data.surface === "grass" && (
        <GrassGarden
          position={[x, top, z]}
          size={data.size}
          lush={data.gardenDensity === "lush"}
          varied={
            data.id === "checkpoint-03-approach" || data.id === "checkpoint-03-approach-b"
          }
        />
      )}
      {data.quoteBoard && (
        <QuoteBoard
          // Default: far-right top edge. positionOffset in world.ts adjusts this per quote.
          position={[
            x + width / 2 - 0.4 + boardOffsetX,
            top + boardOffsetY,
            z - depth / 2 + 0.6 + boardOffsetZ,
          ]}
          rotation={data.quoteBoard.rotation ?? [0, -0.22, 0]}
          quote={data.quoteBoard.quote}
          author={data.quoteBoard.author}
        />
      )}
      {section && (
        <>
          <CheckpointMarker
            position={[x, top, z]}
            radius={Math.min(width, depth) * 0.25}
            color={data.markerColor ?? data.color}
          />
          <CheckpointFlag
            position={[x + labelSide * (width * 0.35), top, z]}
            color={flagColor}
          />
          <Float speed={1.5} rotationIntensity={0} floatIntensity={0.16}>
            {data.model && (
              <SceneModel
                {...data.model}
                position={[labelX + modelOffsetX, top + modelOffsetY, z + modelOffsetZ]}
                anchor="top"
              />
            )}
          </Float>
        </>
      )}
      {data.scenery?.map(({ position, anchor, ...model }, index) => (
        <SceneModel
          key={`${model.url}-${index}`}
          {...model}
          position={position}
          anchor={anchor}
        />
      ))}
      {data.floorText?.map((label) => (
        <Text
          key={label.text}
          position={label.position}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          fontStyle="italic"
          color="#4125255d"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#351701"
          renderOrder={2}
        >
          {label.text}
        </Text>
      ))}
      {showLabel && section && (
        <Html
          position={[labelX, data.position[1] + data.size[1] / 2 + 1.8, data.position[2]]}
          center
          distanceFactor={8}
          transform
          pointerEvents="auto"
          // Keep world labels beneath app dialogs rendered outside the canvas.
          zIndexRange={[5, 0]}
        >
          <div
            className="world-label"
            role="button"
            tabIndex={0}
            onClick={onOpenCheckpoint}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onOpenCheckpoint?.();
            }}
            style={{ cursor: "url('/images/pointer.png') 4 2, pointer" }}
          >
            <span>{section.kicker}</span>
            {section.title}
          </div>
        </Html>
      )}
    </group>
  );
}

function RopeBridge({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) {
  const startPoint = new THREE.Vector3(...start);
  const endPoint = new THREE.Vector3(...end);
  const midpoint = startPoint.clone().lerp(endPoint, 0.5);
  midpoint.y -= 0.34;
  const curve = new THREE.CatmullRomCurve3([startPoint, midpoint, endPoint]);
  const geometry = new THREE.TubeGeometry(curve, 32, 0.07, 8, false);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial color="#9c6141" roughness={1} />
      </mesh>
      <RopeMooring position={start} />
      <RopeMooring position={end} />
    </group>
  );
}

/** Start-platform treatment: a low dark slab with Roblox-inspired raised studs. */
function RobloxBaseplate({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  const [x, y, z] = position;
  const [width, height, depth] = size;
  const top = y + height / 2;
  const spacing = 0.44;
  const columns = Math.floor(width / spacing);
  const rows = Math.floor(depth / spacing);

  return (
    <group>
      <RoundedBox
        args={size}
        radius={0.12}
        smoothness={3}
        position={position}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color={color} roughness={0.88} />
      </RoundedBox>
      {/* Instancing keeps the stud grid inexpensive even with many raised tiles. */}
      <Instances limit={columns * rows}>
        <boxGeometry args={[0.18, 0.045, 0.18]} />
        <meshStandardMaterial color="#89898a" roughness={0.82} />
        {Array.from({ length: columns * rows }, (_, index) => {
          const column = index % columns;
          const row = Math.floor(index / columns);
          return (
            <Instance
              key={index}
              position={[
                x + spacing * (column - (columns - 1) / 2),
                top + 0.025,
                z + spacing * (row - (rows - 1) / 2),
              ]}
            />
          );
        })}
      </Instances>
    </group>
  );
}

function RopeMooring({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;

  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.17, 4]} />
        <meshStandardMaterial color="#918f8f" roughness={1} />
      </mesh>
      <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.115, 0.024, 6, 12]} />
        <meshStandardMaterial color="#4d4c4b" roughness={1} />
      </mesh>
    </group>
  );
}

function WoodBridge({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  const [x, y, z] = position;
  const [width, height, depth] = size;
  const top = y + height / 2;
  const pavementRows = 10;
  const pavementColumns = 4;
  const paverLength = depth / pavementRows;
  const paverWidth = width / pavementColumns;
  const railOffset = width * 0.43;

  return (
    <group>
      <RoundedBox
        args={size}
        radius={0.12}
        smoothness={3}
        position={position}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial color="#29323a" roughness={0.98} />
      </RoundedBox>
      {Array.from({ length: pavementRows }, (_, row) =>
        Array.from({ length: pavementColumns }, (_, column) => {
          const paverX = x - width / 2 + paverWidth * (column + 0.5);
          const paverZ = z - depth / 2 + paverLength * (row + 0.5);
          const paverColors = ["#3d4852", "#34404a", "#46515a"];

          return (
            <mesh
              key={`${row}-${column}`}
              position={[paverX, top + 0.045, paverZ]}
              receiveShadow
              castShadow
            >
              <boxGeometry args={[paverWidth - 0.075, 0.09, paverLength - 0.075]} />
              <meshStandardMaterial
                color={paverColors[(row + column) % paverColors.length]}
                roughness={0.98}
              />
            </mesh>
          );
        }),
      )}
      {[-railOffset, railOffset].map((offsetX) => (
        <group key={offsetX}>
          <mesh position={[x + offsetX, top + 0.54, z]} castShadow>
            <boxGeometry args={[0.12, 0.12, depth * 0.97]} />
            <meshStandardMaterial color="#c83b2d" roughness={0.82} />
          </mesh>
          <mesh position={[x + offsetX, top + 0.29, z]} castShadow>
            <boxGeometry args={[0.075, 0.075, depth * 0.97]} />
            <meshStandardMaterial color="#d84a38" roughness={0.84} />
          </mesh>
          {[-0.42, 0, 0.42].map((progress) => (
            <group
              key={progress}
              position={[x + offsetX, top + 0.33, z + depth * progress]}
            >
              <mesh castShadow>
                <boxGeometry args={[0.14, 0.7, 0.14]} />
                <meshStandardMaterial color="#c83b2d" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.39, 0]} castShadow>
                <boxGeometry args={[0.19, 0.09, 0.19]} />
                <meshStandardMaterial color="#252630" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}

function FloatingStoneIsland({
  position,
  size,
  seed,
}: {
  position: [number, number, number];
  size: [number, number, number];
  seed: string;
}) {
  const [x, y, z] = position;
  const [width, height, depth] = size;
  const underside = y - height / 2;
  const radius = Math.min(width / 2, depth / 2) * 1.14;
  // Deterministic variation means each named island has a stable, distinct underside.
  const hash = Array.from(seed).reduce(
    (total, character) => total + character.charCodeAt(0) * 17,
    0,
  );
  const angle = (hash % 628) / 100;
  const lowerAngle = angle + 0.65 + (hash % 11) / 20;
  const offset = ((hash % 9) - 4) * 0.035;

  return (
    <group>
      {/* A low, faceted stone shelf gives the player a readable landing area. */}
      <mesh position={[x, y, z]} rotation={[0, angle, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius, radius * 0.92, height, 9]} />
        <meshStandardMaterial color="#78818a" roughness={0.94} flatShading />
      </mesh>
      {/* A thin turf cap softens the silhouette and connects it to the other islands. */}
      <mesh
        position={[x, y + height / 2 + 0.035, z]}
        rotation={[0, angle, 0]}
        receiveShadow
      >
        <cylinderGeometry args={[radius * 0.93, radius * 0.93, 0.08, 9]} />
        <meshStandardMaterial color="#70bd5d" roughness={1} flatShading />
      </mesh>
      {/* Stepped, tapering rock layers make the island visibly float instead of reading as a block. */}
      <mesh
        position={[x + offset, underside - 0.34, z - offset]}
        rotation={[Math.PI, lowerAngle, 0]}
        castShadow
      >
        <coneGeometry args={[radius * 0.92, 0.72, 9]} />
        <meshStandardMaterial color="#626c76" roughness={1} flatShading />
      </mesh>
      <mesh
        position={[x + 0.08 + offset, underside - 1.05, z - 0.04 - offset]}
        rotation={[Math.PI, lowerAngle - 0.32, 0]}
        castShadow
      >
        <coneGeometry args={[radius * 0.61, 1.12, 8]} />
        <meshStandardMaterial color="#5b6066" roughness={1} flatShading />
      </mesh>
      <mesh
        position={[x - 0.08 - offset, underside - 1.73, z + 0.06 + offset]}
        rotation={[Math.PI, lowerAngle + 0.24, 0]}
        castShadow
      >
        <coneGeometry args={[radius * 0.28, 0.7, 7]} />
        <meshStandardMaterial color="#5f666d" roughness={1} flatShading />
      </mesh>
    </group>
  );
}

/** Purposefully spaced flowers for the two small platforms before checkpoint 03. */
function createVariedFlowers(x: number) {
  return x < 0
    ? ([
        [-0.34, -0.28, "#ff8fbe"],
        [0.32, -0.16, "#fff4a3"],
        [-0.08, 0.3, "#c9a7ff"],
        [0.35, 0.28, "#fff0f7"],
      ] as const)
    : ([
        [-0.33, 0.27, "#fff0f7"],
        [0.3, -0.3, "#ff8fbe"],
        [-0.26, -0.24, "#fff4a3"],
        [0.23, 0.24, "#c9a7ff"],
      ] as const);
}

function GrassGarden({
  position,
  size,
  lush = false,
  varied = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  lush?: boolean;
  varied?: boolean;
}) {
  const [x, top, z] = position;
  const [width, , depth] = size;
  const flowers = varied
    ? createVariedFlowers(x)
    : lush
      ? ([
          [-0.35, -0.3, "#fff0f7"],
          [-0.1, -0.34, "#fff4a3"],
          [0.2, -0.31, "#c9a7ff"],
          [-0.42, -0.03, "#fff4a3"],
          [-0.22, 0.04, "#c9a7ff"],
          [0.08, -0.02, "#fff0f7"],
          [0.31, 0.08, "#fff4a3"],
          [-0.34, 0.3, "#c9a7ff"],
          [-0.04, 0.28, "#fff0f7"],
          [0.22, 0.34, "#fff4a3"],
          [0.43, 0.27, "#c9a7ff"],
        ] as const)
      : ([
          [-0.28, -0.22, "#fff0f7"],
          [0.27, 0.2, "#fff4a3"],
          [0.08, -0.28, "#c9a7ff"],
        ] as const);
  const grassTufts = lush
    ? ([
        [-0.45, -0.42],
        [-0.27, -0.42],
        [0.04, -0.42],
        [0.33, -0.4],
        [-0.47, -0.17],
        [-0.3, -0.14],
        [-0.02, -0.18],
        [0.18, -0.14],
        [0.46, -0.08],
        [-0.46, 0.17],
        [-0.16, 0.17],
        [0.12, 0.2],
        [0.44, 0.14],
        [-0.43, 0.43],
        [-0.2, 0.42],
        [0.09, 0.43],
        [0.38, 0.42],
      ] as const)
    : [];

  return (
    <group>
      <mesh position={[x, top + 0.035, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.78, depth * 0.78]} />
        <meshStandardMaterial color="#63bf5e" roughness={1} />
      </mesh>
      {/* Reuses public/models/grass.glb instead of the old placeholder cone tufts. */}
      {grassTufts.map(([offsetX, offsetZ], index) => (
        <SceneModel
          key={`grass-${index}`}
          url="/models/grass.glb"
          displaySize={0.32}
          position={[x + offsetX * width, top + 0.04, z + offsetZ * depth]}
          rotation={[0, index * 0.7, 0]}
        />
      ))}
      {flowers.map(([offsetX, offsetZ, petalColor], index) => (
        <Flower
          key={index}
          position={[x + offsetX * width, top + 0.035, z + offsetZ * depth]}
          scale={0.75}
          petalColor={petalColor}
        />
      ))}
    </group>
  );
}

function CheckpointMarker({
  position,
  radius,
  color,
}: {
  position: [number, number, number];
  radius: number;
  color: string;
}) {
  return (
    <mesh
      position={[position[0], position[1] + 0.06, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <ringGeometry args={[radius * 0.82, radius, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} toneMapped={false} />
    </mesh>
  );
}
