import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.DirectionalLight;
    private clouds: THREE.Points[] = [];
    private clock: THREE.Clock = new THREE.Clock();
    private rotationDirections: number[] = [];

    constructor() {
        this.scene = new THREE.Scene();
    }

    public createRendererDOM(width: number, height: number, cameraPos: THREE.Vector3): HTMLCanvasElement {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.shadowMap.enabled = true;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;

        this.createScene();

        const render = () => {
            const delta = this.clock.getDelta();

            this.clouds[0].rotation.x += this.rotationDirections[0] * 0.4 * delta;
            this.clouds[1].rotation.y += this.rotationDirections[1] * 0.6 * delta;
            this.clouds[2].rotation.z += this.rotationDirections[2] * 0.8 * delta;

            controls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";

        return renderer.domElement;
    }

    private createScene() {
        const torusGeometry = new THREE.TorusGeometry(5, 1.5, 16, 100);

        this.clouds.push(this.createPoints(torusGeometry, 0xff0000)); // 赤
        this.clouds.push(this.createPoints(torusGeometry, 0x00ff00)); // 緑
        this.clouds.push(this.createPoints(torusGeometry, 0x0000ff)); // 青

        this.clouds.forEach(cloud => this.scene.add(cloud));

        // ランダムに回転方向を決定 (+1 or -1)
        this.rotationDirections = this.clouds.map(() => (Math.random() < 0.5 ? 1 : -1));

        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(1, 1, 1).normalize();
        this.scene.add(this.light);
    }

    private createPoints(geometry: THREE.BufferGeometry, colorHex: number): THREE.Points {
        const material = new THREE.PointsMaterial({
            size: 0.4,
            map: this.generateSprite(colorHex),
            blending: THREE.AdditiveBlending,
            transparent: true,
            depthWrite: false,
        });
        return new THREE.Points(geometry, material);
    }

    private generateSprite(colorHex: number): THREE.Texture {
        const size = 16;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;

        const context = canvas.getContext("2d")!;
        const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);

        const color = new THREE.Color(colorHex);
        const white = new THREE.Color(0xffffff);
        const darkBlue = new THREE.Color(0x000040);
        const black = new THREE.Color(0x000000);

        gradient.addColorStop(0, white.getStyle());
        gradient.addColorStop(0.2, color.getStyle());
        gradient.addColorStop(0.4, darkBlue.getStyle());
        gradient.addColorStop(1, black.getStyle().replace("rgb", "rgba").replace(")", ",0)"));

        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size);

        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        return texture;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 20));
    document.body.appendChild(viewport);
});
