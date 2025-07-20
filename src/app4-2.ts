import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() { }

    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x88ccff));
        renderer.shadowMap.enabled = true;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 1, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        const render: FrameRequestCallback = () => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);

        renderer.domElement.style.float = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };

    private createScene = () => {
        this.scene = new THREE.Scene();

        // ライト
        this.light = new THREE.DirectionalLight(0xffffff, 1.2);
        this.light.position.set(5, 10, 5);
        this.scene.add(this.light);
        this.scene.add(new THREE.AmbientLight(0x404040));

        // 地面
        this.addGround();

        // レール
        const railMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
        const railGeometry = new THREE.BoxGeometry(0.05, 0.1, 12);
        const railLeft = new THREE.Mesh(railGeometry, railMaterial);
        const railRight = new THREE.Mesh(railGeometry, railMaterial);
        railLeft.position.set(-0.6, 0.05, 2.5); // x位置修正
        railRight.position.set(0.6, 0.05, 2.5); // x位置修正
        this.scene.add(railLeft, railRight);

        // 枕木
        const sleeperMaterial = new THREE.MeshPhongMaterial({ color: 0x885533 });
        for (let i = 0; i <= 14; i++) {
            const sleeper = new THREE.Mesh(
                new THREE.BoxGeometry(1.4, 0.05, 0.15),
                sleeperMaterial
            );
            sleeper.position.set(0, 0.025, -3 + i * 0.8); // z方向を等間隔、x=0に修正
            this.scene.add(sleeper);
        }

        // 電車
        const trainShape = new THREE.Shape();
        trainShape.moveTo(-0.5, 0);
        trainShape.lineTo(-0.5, 1.5);
        trainShape.quadraticCurveTo(0, 2, 0.5, 1.5);
        trainShape.lineTo(0.5, 0);
        trainShape.lineTo(-0.5, 0);

        const extrudeSettings = { depth: 3, bevelEnabled: false };
        const trainGeometry = new THREE.ExtrudeGeometry(trainShape, extrudeSettings);
        const trainMaterial = new THREE.MeshPhongMaterial({ color: 0xdd3333 });

        const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });

        for (let i = 0; i < 3; i++) {
            const trainMesh = new THREE.Mesh(trainGeometry, trainMaterial);
            trainMesh.position.set(0, 0, -1.5 + i * 3.1);
            this.scene.add(trainMesh);

            const baseZ = -1.5 + i * 3.1;
            const wheelPositions = [
                [-0.6, 0.25, baseZ],
                [-0.6, 0.25, baseZ + 2.5],
                [0.6, 0.25, baseZ],
                [0.6, 0.25, baseZ + 2.5],
            ];
            wheelPositions.forEach(pos => {
                const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(pos[0], pos[1], pos[2]);
                this.scene.add(wheel);
            });
        }

        // ポールと警笛のセット
        const hornProfile = [
            new THREE.Vector2(0.0, 0.0),
            new THREE.Vector2(0.08, 0.0),
            new THREE.Vector2(0.1, 0.1),
            new THREE.Vector2(0.15, 0.2),
            new THREE.Vector2(0.1, 0.28),
            new THREE.Vector2(0.0, 0.3),
        ];
        const hornGeometry = new THREE.LatheGeometry(hornProfile, 32);
        const hornMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });

        // 警笛とポールの位置の管理
        const hornPositions = [
            { x: -2.5, z: 9.5 }, 
            { x: 2.5, z: 9.5 },
            { x: -2.5, z: -2.5 }
        ];

        hornPositions.forEach(pos => {
            const post = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 1.5, 0.1),
                new THREE.MeshPhongMaterial({ color: 0x333333 })
            );
            post.position.set(pos.x, 0.75, pos.z);
            this.scene.add(post);

            const horn = new THREE.Mesh(hornGeometry, hornMaterial);
            horn.rotation.x = Math.PI / 2;
            horn.position.set(pos.x, 1.5, pos.z);
            this.scene.add(horn);
        });
    }



    private addGround() {
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshPhongMaterial({ color: 0x228833 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.01;
        this.scene.add(ground);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(800, 600, new THREE.Vector3(2, 2.5, 6));
    document.body.appendChild(viewport);
}
