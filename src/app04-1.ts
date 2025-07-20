import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() {}

    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x00aaff));
        renderer.shadowMap.enabled = true;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 2.5, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        const render: FrameRequestCallback = () => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    private createScene = () => {
        this.scene = new THREE.Scene();

        this.light = new THREE.DirectionalLight(0xffffff, 1);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        const points: THREE.Vector2[] = [];

        const height = 2.5;  // 高さ
        const nPoints = 50; // 点の数
        const a = 0.09;    // 基本の半径スケール（下端の太さ）
        const b = 2;       // 広がりの強さ（大きいほど急激に広がる）

        for (let i = 0; i <= nPoints; i++) {
            const t = i / nPoints;    // 0～1
            const y = t * height;

            // 半径を指数関数的に変化
            const radius = a * Math.exp(b * t);

            points.push(new THREE.Vector2(radius, y));
        }

        const geometry = new THREE.LatheGeometry(points, 64);
        const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);

        this.scene.add(mesh);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 3, 10));
    document.body.appendChild(viewport);
});