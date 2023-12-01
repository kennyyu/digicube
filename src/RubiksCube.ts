import * as THREE from 'three';

enum Color {
  blue = "blue",
  green = "green",
  orange = "orange",
  red = "red",
  white = "white",
  yellow = "yellow",
}

class CubeFaceColors {
  public up: Color;
  public down: Color;
  public front: Color;
  public back: Color;
  public right: Color;
  public left: Color;

  constructor(
    up: Color,
    down: Color,
    front: Color,
    back: Color,
    right: Color,
    left: Color,
  ) {
    this.up = up;
    this.down = down;
    this.front = front;
    this.back = back;
    this.right = right;
    this.left = left;
  }

  public x(clockwise: boolean): void {
    if (clockwise) {
      // front -> up -> back -> down
      const temp = this.front;
      this.front = this.down;
      this.down = this.back;
      this.back = this.up;
      this.up = temp;
    } else {
      // front -> down -> back -> up
      const temp = this.front;
      this.front = this.up;
      this.up = this.back;
      this.back = this.down;
      this.down = temp;
    }
  }

  public y(clockwise: boolean): void {
    if (clockwise) {
      // front -> left -> back -> right
      const temp = this.front;
      this.front = this.right;
      this.right = this.back;
      this.back = this.left;
      this.left = temp;
    } else {
      // front -> right -> back -> left
      const temp = this.front;
      this.front = this.left;
      this.left = this.back;
      this.back = this.right;
      this.right = temp;
    }
  }

  public z(clockwise: boolean): void {
    if (clockwise) {
      // up -> right -> down -> left
      const temp = this.up;
      this.up = this.left;
      this.left = this.down;
      this.down = this.right;
      this.right = temp;
    } else {
      // up -> left -> down -> right
      const temp = this.up;
      this.up = this.right;
      this.right = this.down;
      this.down = this.left;
      this.left = temp;
    }
  }
}

// Represents a single cube
class CubeMesh extends THREE.Mesh {
  public colors: CubeFaceColors;

  constructor(
    position: THREE.Vector3,
    materials: THREE.MeshBasicMaterial[],
    colors: CubeFaceColors,
  ) {
    super(new THREE.BoxGeometry(1, 1, 1), materials);
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    this.colors = colors;
  }
}

enum Axis {
  x = 'x',
  y = 'y',
  z = 'z',
}

// TODO: direction
// All move types -- this is exposed externally (Cube3x3 delegates to Cube)
// F0, F1, F2, ... x, y, z
// =>
// map into primitives -- this is used internally (Cube)
// F0 => (7x7, x, clockwise, [0])
// x => (7x7, x, clockwise, [0,1,2,3,4,5,6])
type CubeMove2 = {
  axis: Axis;
  clockwise: boolean;
  cubeSize: number;
  // Layers always start from the positive axis direction.
  // X, layer 0 == R. Y, layer 0 == U. Z, layer 0 == F
  layers: number[];
};

function getCubeCoords(cubeSize: number, layers: number[]): number[] {
  const initialCoord = (cubeSize - 1) / 2;
  return layers.map((x) => initialCoord - x);
}

enum CubeFaceTurn {
  F = "F",
  F_inv = "F_inv",
  B = "B",
  B_inv = "B_inv",
  U = "U",
  U_inv = "U_inv",
  D = "D",
  D_inv = "D_inv",
  R = "R",
  R_inv = "R_inv",
  L = "L",
  L_inv = "L_inv",
}

// TODO: make layers a list
// Full cube rotation is == rotate all layers
// Represents all possible moves on a cube
type CubeMove = {
  cubeSize: number;
  cubeFaceTurn: CubeFaceTurn;
  layerNum: number;
};

// Returns the positions of cubes that need to be rotated
type CubeMovePosition = {
  axis: Axis;
  clockwise: boolean;
  coord: number;
};

// TODO: don't need B. It is a special case of F.
function getCubeFaceTurnBasePosition(
  cubeFaceTurn: CubeFaceTurn,
): CubeMovePosition {
  switch (cubeFaceTurn) {
    case CubeFaceTurn.F:
      return {
        axis: Axis.z,
        clockwise: true,
        coord: 1,
      };
    case CubeFaceTurn.F_inv:
      return {
        axis: Axis.z,
        clockwise: false,
        coord: 1,
      };
    case CubeFaceTurn.B:
      return {
        axis: Axis.z,
        clockwise: true,
        coord: -1,
      };
    case CubeFaceTurn.B_inv:
      return {
        axis: Axis.z,
        clockwise: false,
        coord: -1,
      };
    case CubeFaceTurn.U:
      return {
        axis: Axis.y,
        clockwise: true,
        coord: 1,
      };
    case CubeFaceTurn.U_inv:
      return {
        axis: Axis.y,
        clockwise: false,
        coord: 1,
      };
    case CubeFaceTurn.D:
      return {
        axis: Axis.y,
        clockwise: true,
        coord: -1,
      };
    case CubeFaceTurn.D_inv:
      return {
        axis: Axis.y,
        clockwise: false,
        coord: -1,
      };
    case CubeFaceTurn.R:
      return {
        axis: Axis.x,
        clockwise: true,
        coord: 1,
      };
    case CubeFaceTurn.R_inv:
      return {
        axis: Axis.x,
        clockwise: false,
        coord: 1,
      };
    case CubeFaceTurn.L:
      return {
        axis: Axis.x,
        clockwise: true,
        coord: -1,
      };
    case CubeFaceTurn.L_inv:
      return {
        axis: Axis.x,
        clockwise: false,
        coord: -1,
      };
  }
}

function getCubeMovePosition(cubeMove: CubeMove): CubeMovePosition {
  const basePosition = getCubeFaceTurnBasePosition(cubeMove.cubeFaceTurn);
  const initialCoord = (cubeMove.cubeSize - 1) / 2;
  const layerCoord = basePosition.coord *
    (initialCoord - cubeMove.layerNum);
  return {
    ...basePosition,
    coord: layerCoord,
  };
}

// F is F0
// 3x3
// F: z == 1, B: z == -1
// 4x4
// F: z == 1.5, F1 = 0.5, B1 = -0.5, B = -1.5
// 5x5
// F: z == 2, F1 == 1, B1 == -1, B == -2
// 6x6
// F: z == 2.5, F1 == 1.5, F2 == 0.5, B2 == -0.5, F1 == -1.5, F6 == -2.5

// Need a map of (Cube Size, Num) => offset
// (5x5, 2) => 1
// (6x6, 1) => 2.5; (6x6, 2) => 1.5, (6x6, 3) => 0.5
// Need a map of symbol to sign
// F => +1; B => -1
// Combine it all together (cube size, move) -> (axis, position):
// (6x6, F2) => letter_lookup(F) * num_lookup(2) => index

// Creates (cubeSize x cubeSize x cubeSize) cubes, where the cubes
// are centered around the origin.
function generateCubeCluster(
  cubeSize: number,
  materials: THREE.MeshBasicMaterial[],
): CubeMesh[] {
  const startingPos = -(cubeSize - 1) / 2;
  const endingPos = (cubeSize - 1) / 2;
  const cubes = [];
  for (let z = startingPos; z <= endingPos; z += 1) {
    for (let y = startingPos; y <= endingPos; y += 1) {
      for (let x = startingPos; x <= endingPos; x += 1) {
        // Don't render internal cubes
        if (x !== startingPos
          && x !== endingPos
          && y !== startingPos
          && y !== endingPos
          && z !== startingPos
          && z !== endingPos) {
          continue;
        }
        const cube = new CubeMesh(
          new THREE.Vector3(x, y, z),
          materials,
          new CubeFaceColors(
            Color.orange,
            Color.red,
            Color.white,
            Color.yellow,
            Color.blue,
            Color.green,
          ),
        );
        cubes.push(cube);
      }
    }
  }
  return cubes;
}

// Renders the scene into the provided canvas, using the camera parameters
class CameraView {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  constructor(
    canvas: HTMLCanvasElement,
    position: THREE.Vector3,
    lookAt: THREE.Vector3,
  ) {
    this.camera = new THREE.PerspectiveCamera();
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.lookAt(lookAt.x, lookAt.y, lookAt.z);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvas,
      alpha: true,
    });
    this.renderer.autoClear = false;
    this.renderer.domElement.style.width = canvas.style.width;
    this.renderer.domElement.style.height = canvas.style.height;
  }

  public resize(): void {
    // TODO: figure out how to make it work on mobile screen
    /*
    const canvas = this.renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;

    if (canvas.width !== width || canvas.height !== height) {
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    }
    */
  }

  public render(scene: THREE.Scene): void {
    this.renderer.render(scene, this.camera);
  }
}

export default class RubiksCube {
  private locked: boolean = false;
  private materials: THREE.MeshBasicMaterial[];
  private speed: number;
  private cubeSize: number;
  private scene: THREE.Scene;
  private cameraMainView: CameraView;
  private cameraViews: CameraView[];

  constructor(
    cubeSize: number,
    canvas: HTMLCanvasElement,
    canvasFront: HTMLCanvasElement,
    canvasBack: HTMLCanvasElement,
    canvasUp: HTMLCanvasElement,
    canvasDown: HTMLCanvasElement,
    canvasRight: HTMLCanvasElement,
    canvasLeft: HTMLCanvasElement,
    materials: THREE.MeshBasicMaterial[],
    speed: number = 1000,
  ) {
    console.log(`creating cube size:${cubeSize}`);

    this.cubeSize = cubeSize;
    this.materials = materials;
    this.speed = speed;

    this.scene = new THREE.Scene();
    this.scene.add(...generateCubeCluster(this.cubeSize, this.materials));

    this.cameraViews = [];

    const cameraMainDistance = cubeSize * 1.2;

    this.cameraMainView = new CameraView(
      canvas,
      new THREE.Vector3(cameraMainDistance, cameraMainDistance, cameraMainDistance),
      new THREE.Vector3(0, 0, 0));

    /*
    // Main view
    this.cameraViews.push(new CameraView(
      canvas,
      new THREE.Vector3(cameraMainDistance, cameraMainDistance, cameraMainDistance),
      new THREE.Vector3(0, 0, 0)));
    */

    // Camera distance for the face views. It needs to be scaled up in order
    // to fit the entire camera within view.
    const cameraFaceDistance = cubeSize * 1.57;

    // Front view
    this.cameraViews.push(new CameraView(
      canvasFront,
      new THREE.Vector3(0, 0, cameraFaceDistance),
      new THREE.Vector3(0, 0, 0)));

    // Back view
    this.cameraViews.push(new CameraView(
      canvasBack,
      new THREE.Vector3(0, 0, -cameraFaceDistance),
      new THREE.Vector3(0, 0, 0)));

    // Up view
    this.cameraViews.push(new CameraView(
      canvasUp,
      new THREE.Vector3(0, cameraFaceDistance, 0),
      new THREE.Vector3(0, 0, 0)));

    // Down view
    this.cameraViews.push(new CameraView(
      canvasDown,
      new THREE.Vector3(0, -cameraFaceDistance, 0),
      new THREE.Vector3(0, 0, 0)));

    // Right view
    this.cameraViews.push(new CameraView(
      canvasRight,
      new THREE.Vector3(cameraFaceDistance, 0, 0),
      new THREE.Vector3(0, 0, 0)));

    // Left view
    this.cameraViews.push(new CameraView(
      canvasLeft,
      new THREE.Vector3(-cameraFaceDistance, 0, 0),
      new THREE.Vector3(0, 0, 0)));

    this.resize();
    this.render();
  }

  public resize() {
    for (const cameraView of this.cameraViews) {
      cameraView.resize();
    }
  }

  private renderMain() {
    window.requestAnimationFrame(this.renderMain.bind(this));
    this.cameraMainView.render(this.scene);
  }

  private renderFaces() {
    for (const cameraView of this.cameraViews) {
      cameraView.render(this.scene);
    }
  }

  private render() {
    this.renderMain();
    this.renderFaces();
    // Initial load may not have loaded assets yet
    setTimeout(this.renderFaces.bind(this), 200);
  }

  /*
  private render() {
    window.requestAnimationFrame(this.render.bind(this));
    for (const cameraView of this.cameraViews) {
      cameraView.render(this.scene);
    }
  }
  */

  // Front
  public async F2(clockwise: boolean = true, duration: number = this.speed) {
    // TODO: adjust for bigger cubes
    //const cubes = this.scene.children.filter(
    // (node) => node instanceof CubeMesh && node.position.z === 2);
    /*
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh && node.position.z === 1);
    await this.rotate(cubes, Axis.z, clockwise, duration);
    */
    const cubeMovePosition = getCubeMovePosition({
      cubeSize: this.cubeSize,
      cubeFaceTurn: CubeFaceTurn.F,
      layerNum: 0,
    });

    const cubes = this.scene.children.filter(
      (node) => {
        if (!(node instanceof CubeMesh)) {
          return false;
        }
        switch (cubeMovePosition.axis) {
          case Axis.x:
            return node.position.x == cubeMovePosition.coord;
          case Axis.y:
            return node.position.y == cubeMovePosition.coord;
          case Axis.z:
            return node.position.z == cubeMovePosition.coord;
        }
      });
    await this.rotate(cubes, cubeMovePosition.axis, cubeMovePosition.clockwise, duration);
  }

  public async F(clockwise: boolean = true, duration: number = this.speed) {
    await this.doMove({
      axis: Axis.z,
      clockwise: clockwise,
      cubeSize: this.cubeSize,
      layers: [0],
    });
  }

  private async doMove(cubeMove: CubeMove2, duration: number = this.speed) {
    const coords = getCubeCoords(cubeMove.cubeSize, cubeMove.layers);
    const cubes = this.scene.children.filter(
      (node) => {
        if (!(node instanceof CubeMesh)) {
          return false;
        }
        switch (cubeMove.axis) {
          case Axis.x:
            return coords.includes(node.position.x);
          case Axis.y:
            return coords.includes(node.position.y);
          case Axis.z:
            return coords.includes(node.position.z);
        }
      });
    await this.rotate(cubes, cubeMove.axis, cubeMove.clockwise, duration);
  }

  // Back
  public async B(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh && node.position.z === -1);
    await this.rotate(cubes, Axis.z, clockwise, duration);
  }

  // Up
  public async U(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh && node.position.y === 1);
    await this.rotate(cubes, Axis.y, clockwise, duration);
  }

  // Down
  public async D(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh && node.position.y === -1);
    await this.rotate(cubes, Axis.y, clockwise, duration);
  }

  // Left
  public async L(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh && node.position.x === -1);
    await this.rotate(cubes, Axis.x, clockwise, duration);
  }

  // Right
  public async R(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh && node.position.x === 1);
    await this.rotate(cubes, Axis.x, clockwise, duration);
  }

  // Cube on x axis
  public async x(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh);
    await this.rotate(cubes, Axis.x, clockwise, duration);
  }

  // Cube on y axis
  public async y(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh);
    await this.rotate(cubes, Axis.y, clockwise, duration);
  }

  // Cube on z axis
  public async z2(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter(
      (node) => node instanceof CubeMesh);
    await this.rotate(cubes, Axis.z, clockwise, duration);
  }

  public async z(clockwise: boolean = true, duration: number = this.speed) {
    await this.doMove({
      axis: Axis.z,
      clockwise: clockwise,
      cubeSize: this.cubeSize,
      layers: Array.from(Array(this.cubeSize).keys()),
    });
  }

  private async rotate(
    cubes: THREE.Object3D[],
    axis: Axis,
    clockwise: boolean = false,
    duration: number,
  ) {
    if (!this.locked) {
      this.locked = true;
      const group = cubes.reduce(
        (acc, cube) => acc.add(cube), new THREE.Object3D());

      this.scene.add(group);

      await this.rotateObject(group, axis, clockwise, duration);

      for (const cube of cubes) {
        if (cube instanceof CubeMesh) {
          switch (axis) {
            case Axis.x:
              cube.colors.x(clockwise);
              break;
            case Axis.y:
              cube.colors.y(clockwise);
              break;
            case Axis.z:
              cube.colors.z(clockwise);
              break;
            default:
              break;
          }
        }
      }

      // Even-sized cubes will have individual cubes at 0.5 coordinates.
      // We need to round to the nearest half.
      const roundToNearestHalf = (x: number) => Math.round(2 * x) / 2;

      for (let i = group.children.length - 1; i >= 0; i--) {
        const child = group.children[i];
        this.scene.attach(child);
        child.position.set(
          roundToNearestHalf(child.position.x),
          roundToNearestHalf(child.position.y),
          roundToNearestHalf(child.position.z));
      }

      this.scene.remove(group);
      this.locked = false;

      this.renderFaces();
    }
  }

  private async rotateObject(
    object: THREE.Object3D,
    axis: Axis,
    clockwise: boolean,
    duration: number,
    start?: number,
  ) {
    return new Promise<void>(async (resolve) => {
      window.requestAnimationFrame(async (timestamp) => {
        const s = start || timestamp;
        const elapsed = timestamp - s;

        const radians = (clockwise ? -1 : 1) * THREE.MathUtils.degToRad(
          Math.min(elapsed / duration, 1) * 90);

        switch (axis) {
          case Axis.x:
            object.rotation.set(radians, 0, 0);
            break;
          case Axis.y:
            object.rotation.set(0, radians, 0);
            break;
          case Axis.z:
            object.rotation.set(0, 0, radians);
            break;
          default:
            break;
        }

        return elapsed <= duration
          ? resolve(this.rotateObject(object, axis, clockwise, duration, s))
          : resolve();
      });
    });
  }
}
