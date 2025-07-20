//23FI028 小野寺こなみ
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private group: THREE.Group;
    private scene: THREE.Scene;
    private plane: THREE.Mesh;

    constructor() {

    }

    // 画面部分の作成(表示する枠ごとに)*
    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x495ed));
        renderer.shadowMap.enabled = true; // シャドウを有効にする

        //カメラの設定
        let camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        //let camera = new THREE.OrthographicCamera(width / -150.0, width / 150.0, height / 150.0, height / -150.0, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        let render: FrameRequestCallback = (time) => {
            orbitControls.update();

            renderer.render(this.scene, camera);// シーンを描画
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    // シーンの作成(全体で1回)
    private createScene = () => {
        this.group = new THREE.Group();
        this.scene = new THREE.Scene();

        let geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        let matArray = [];
        matArray.push(new THREE.MeshBasicMaterial({ color: 0x009e60 }));// 光の影響を受けない
        matArray.push(new THREE.MeshNormalMaterial());// 法線表示マテリアル
        matArray.push(new THREE.MeshLambertMaterial({ color: 0xffd500 }));// 拡散反射
        matArray.push(new THREE.MeshPhongMaterial({ color: 0xff5800,shininess:100 }));// 光沢
        matArray.push(new THREE.MeshStandardMaterial({ color: 0xc41e3a }));// PBR
        matArray.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));// 光の影響を受けない
        let mesh = new THREE.Mesh(geometry, matArray);
        this.group.add(mesh);

        // オブジェクトを3x3に並べて生成
        for (let x = 0; x < 3; x++) {
            for (let y =0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    // メッシュの生成
                    let mesh = new THREE.Mesh(geometry, matArray);
                    mesh.castShadow = true;
                    // メッシュの位置を設定
                    mesh.position.set(x * 2 - 2, y * 2 - 2, z * 2 - 2);
                    // メッシュをシーンに追加
                    this.group.add(mesh);
                }
            }
        }
        this.scene.add(this.group);
        // 平面の生成
        let planeGeometry = new THREE.PlaneGeometry(20, 20);
        let planeMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.receiveShadow = true; //影を受けるようにする
        this.plane.position.y = -5;
        this.plane.rotation.x = -Math.PI / 2;
        this.scene.add(this.plane);

        //ライトの設定
        let light = new THREE.DirectionalLight(0xffffff, 1.0);
        light.position.set(1, 1, 1);
        light.target = this.plane;
        light.castShadow = true;

        // let light = new THREE.AmbientLight(0xffffff, 0.5);

        // let light = new THREE.PointLight(0xffffff, 1.0);
        // light.position.set(5, 5, 5);
        // light.castShadow = true;

        // let light = new THREE.SpotLight(0xffffff, 1.0);
        // light.position.set(5, 5, 5);
        // light.castShadow = true;
        // light.target = this.plane;

        this.scene.add(light);

        // 毎フレームのupdateを呼んで，更新
        // reqestAnimationFrame により次フレームを呼ぶ
        let update: FrameRequestCallback = (time) => {
            this.group.rotateX(0.01);
            requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();

    let viewport = container.createRendererDOM(640, 480, new THREE.Vector3(-6, 6, 6));
    document.body.appendChild(viewport);
}
