// // 23FI028 小野寺こなみ
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private waveMesh: THREE.Mesh;
    private kleinMesh: THREE.Mesh;
    private light: THREE.Light;
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;

    constructor() {}

    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x00aaff)); // 背景色変更
        renderer.shadowMap.enabled = true;

        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.copy(cameraPos);
        this.camera.lookAt(0, 0, 0);

        this.controls = new OrbitControls(this.camera, renderer.domElement);

        this.createScene();

        const animate: FrameRequestCallback = () => {
            this.controls.update();
            renderer.render(this.scene, this.camera);
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);

        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    }

    private createScene = () => {
        this.scene = new THREE.Scene();

        // ライト
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        let lvec = new THREE.Vector3(1,1,1).normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);

        let gui = new GUI();
        let guiObj = {object: 'Wave'}
        gui.add( guiObj, 'object',['Wave','Klein']);
        
        let myPlane = (u:number, v:number, target:THREE.Vector3) =>{
            let r = 30;
            let x = u * r - r/2;
            let z = v * r - r/2;
            let y = Math.sin(Math.sqrt(x * x + z *z)) * 2.0;

            target.set(x,y,z);
        }
        let myKlein = (u:number, v:number, target:THREE.Vector3) =>{
            u = u * 2 * Math.PI;
            v = v * 2 * Math.PI;
            let r = 4 - 2 * Math.cos(u);
            let x = 0;
            let y = 0;
            if(u < Math.PI){
                x = 6 * Math.cos(u) * (1 + Math.sin(u)) + r * Math.cos(u) * Math.cos(v);
                y = 16 * Math.sin(u) + r * Math.sin(u) + r * Math.cos(u) * Math.cos(v);
            } 
        }
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const container = new ThreeJSContainer();
    const viewport = container.createRendererDOM(640, 480, new THREE.Vector3(30, 30, 30));
    document.body.appendChild(viewport);
});
