import * as THREE from 'three';

type CubeMeshProps = {
  position: THREE.Vector3;
  materials: THREE.MeshBasicMaterial[];
};

class CubeMesh extends THREE.Mesh {
  constructor({ position, materials }: CubeMeshProps) {
    super(new THREE.BoxGeometry(1, 1, 1), materials);
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
  }
}

enum Axis {
  x = 'x',
  y = 'y',
  z = 'z',
}

function generateCubeCluster(materials: THREE.MeshBasicMaterial[]): CubeMesh[] {
  const cubes = [];
  for (let z = -1; z < 2; z++) {
    for (let y = -1; y < 2; y++) {
      for (let x = -1; x < 2; x++) {
        const cube = new CubeMesh({
          position: new THREE.Vector3(x, y, z),
          materials: materials,
        });
        cubes.push(cube);
      }
    }
  }
  return cubes;
}

class CameraView {
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.Renderer;

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
    this.renderer.domElement.style.width = canvas.style.width;
    this.renderer.domElement.style.height = canvas.style.height;
  }

  public resize(): void {
    const canvas = this.renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;

    if (canvas.width !== width || canvas.height !== height) {
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
    }
  }

  public render(scene: THREE.Scene): void {
    this.renderer.render(scene, this.camera);
  }
}

export default class RubiksCube {
  private locked: boolean = false;
  private materials: THREE.MeshBasicMaterial[];
  private speed: number;
  private scene: THREE.Scene;
  private cameraViews: CameraView[];

  constructor(
    canvas: HTMLCanvasElement,
    canvasLeft: HTMLCanvasElement,
    canvasBack: HTMLCanvasElement,
    canvasDown: HTMLCanvasElement,
    materials: THREE.MeshBasicMaterial[],
    speed: number = 1000,
  ) {
    this.materials = materials;
    this.speed = speed;

    this.scene = new THREE.Scene();
    this.scene.add(...generateCubeCluster(this.materials));

    this.cameraViews = [];

    // Main view
    this.cameraViews.push(new CameraView(
      canvas,
      new THREE.Vector3(4, 4, 4),
      new THREE.Vector3(0, -0.33, 0)));

    // Left view
    this.cameraViews.push(new CameraView(
      canvasLeft,
      new THREE.Vector3(-10, 0.5, 0.5),
      new THREE.Vector3(0, 0.5, 0.5)))

    // Back view
    this.cameraViews.push(new CameraView(
      canvasBack,
      new THREE.Vector3(0.5, 0.5, -10),
      new THREE.Vector3(0.5, 0.5, 0)))

    // Down view
    this.cameraViews.push(new CameraView(
      canvasDown,
      new THREE.Vector3(0.5, -10, 0.5),
      new THREE.Vector3(0.5, 0, 0.5)))

    this.resize();
    this.render();
  }

  public resize() {
    for (const cameraView of this.cameraViews) {
      cameraView.resize();
    }
  }

  private render() {
    window.requestAnimationFrame(this.render.bind(this));
    for (const cameraView of this.cameraViews) {
      cameraView.render(this.scene);
    }
  }

  // Front
  public async F(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh && node.position.z === 1);
    await this.rotate(cubes, Axis.z, clockwise, duration);
  }

  // Back
  public async B(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh && node.position.z === -1);
    await this.rotate(cubes, Axis.z, clockwise, duration);
  }

  // Up
  public async U(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh && node.position.y === 1);
    await this.rotate(cubes, Axis.y, clockwise, duration);
  }

  // Down
  public async D(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh && node.position.y === -1);
    await this.rotate(cubes, Axis.y, clockwise, duration);
  }

  // Left
  public async L(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh && node.position.x === -1);
    await this.rotate(cubes, Axis.x, clockwise, duration);
  }

  // Right
  public async R(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh && node.position.x === 1);
    await this.rotate(cubes, Axis.x, clockwise, duration);
  }

  // Cube on x axis
  public async x(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh);
    await this.rotate(cubes, Axis.x, clockwise, duration);
  }

  // Cube on y axis
  public async y(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh);
    await this.rotate(cubes, Axis.y, clockwise, duration);
  }

  // Cube on z axis
  public async z(clockwise: boolean = true, duration: number = this.speed) {
    const cubes = this.scene.children.filter((node) => node instanceof CubeMesh);
    await this.rotate(cubes, Axis.z, clockwise, duration);
  }

  private async rotate(
    cubes: THREE.Object3D[],
    axis: Axis,
    clockwise: boolean = false,
    duration: number,
  ) {
    if (!this.locked) {
      this.locked = true;
      const group = cubes.reduce((acc, cube) => acc.add(cube), new THREE.Object3D());

      this.scene.add(group);

      await this.rotateObject(group, axis, clockwise, duration);

      for (let i = group.children.length - 1; i >= 0; i--) {
        const child = group.children[i];
        this.scene.attach(child);
        child.position.set(
          Math.round(child.position.x),
          Math.round(child.position.y),
          Math.round(child.position.z));
      }

      this.scene.remove(group);
      this.locked = false;
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
