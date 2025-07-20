import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.Light;

    constructor() {}

    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3): HTMLElement => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        const render: FrameRequestCallback = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    private createScene = () => {
        this.scene = new THREE.Scene();
        
        // 頂点座標 (8要素)
        const positions = new Float32Array([
            -0.5, -0.5, -0.5, // 0: 左下奥
             0.5, -0.5, -0.5, // 1: 右下奥
            -0.5,  0.5, -0.5, // 2: 左上奥
             0.5,  0.5, -0.5, // 3: 右上奥
            -0.5, -0.5,  0.5, // 4: 左下手前
             0.5, -0.5,  0.5, // 5: 右下手前
            -0.5,  0.5,  0.5, // 6: 左上手前
             0.5,  0.5,  0.5  // 7: 右上手前
        ]);

        // 各頂点の色 (黒、白、赤、緑、青、イエロー、シアン、マゼンタ)
        // どの頂点をどの色にするかは任意とします。
        // ここでは、頂点インデックス0から順に割り当てます。
        const colors = new Float32Array([
            0.0, 0.0, 0.0, // 0: 黒
            1.0, 1.0, 1.0, // 1: 白
            1.0, 0.0, 0.0, // 2: 赤
            0.0, 1.0, 0.0, // 3: 緑
            0.0, 0.0, 1.0, // 4: 青
            1.0, 1.0, 0.0, // 5: イエロー
            0.0, 1.0, 1.0, // 6: シアン
            1.0, 0.0, 1.0  // 7: マゼンタ
        ]);

        // 頂点インデックス
        const indices = new Uint16Array([
            // 手前面
            4, 5, 7,   4, 7, 6, 
            // 奥面
            1, 0, 2,   1, 2, 3, 
            // 左面
            0, 4, 6,   0, 6, 2, 
            // 右面
            5, 1, 3,   5, 3, 7, 
            // 底面
            0, 1, 5,   0, 5, 4, 
            // 天面
            2, 6, 7,   2, 7, 3  
        ]);

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));
        geometry.computeVertexNormals();

        const material = new THREE.MeshBasicMaterial({ vertexColors: true });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    
        this.light = new THREE.DirectionalLight(0xffffff);
        const lvec = new THREE.Vector3(1, 1, 1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
    
        let update: FrameRequestCallback = (time) => {
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(0, 0, 10));
    document.body.appendChild(viewport);
}