import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJSContainer {
    private scene: THREE.Scene;
    private light: THREE.DirectionalLight;
    private horse: THREE.Group;
    private jackOLanterns: THREE.Group[] = [];

    // パスアニメーション用のプロパティ
    private clock: THREE.Clock = new THREE.Clock();
    private t: number = 0;
    private seg: number = 0;

    // Bezier曲線の制御点
    private points: THREE.Vector3[] = [
        // Segment 1
        new THREE.Vector3(-15, 0, 0),
        new THREE.Vector3(-10, 0, 15),
        new THREE.Vector3(10, 0, 15),
        new THREE.Vector3(15, 0, 0),

        // Segment 2
        new THREE.Vector3(15, 0, 0),
        // P1_s2: P0_s2 + (P0_s2 - P2_s1) = (15,0,0) + ((15,0,0) - (10,0,15)) = (20,0,-15)
        new THREE.Vector3(20, 0, -15),
        // P2_s2: P3_s2 + (P3_s2 - P1_s1) = (-15,0,0) + ((-15,0,0) - (-10,0,15)) = (-20,0,-15)
        new THREE.Vector3(-20, 0, -15),
        new THREE.Vector3(-15, 0, 0)
    ];

    private pathDuration: number = 12;
    private floorSize: number = 25; // 床のサイズ

    constructor() {
    }

    public createRendererDOM = (width: number, height: number, cameraPos: THREE.Vector3) => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new THREE.Color(0x000000));
        renderer.shadowMap.enabled = true;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        this.createScene();

        const render: FrameRequestCallback = (time) => {
            orbitControls.update();

            this.animateHorse(); // 馬のアニメーション
            this.animateJackOLanterns(time);

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
        this.scene.fog = new THREE.Fog(0x333333, 20, 100);

        // ライトの設定
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        this.light = new THREE.DirectionalLight(0xffffff, 0.6);
        this.light.position.set(5, 10, 5);
        this.light.castShadow = true;
        this.scene.add(this.light);

        // 床の作成
        const floorGeometry = new THREE.PlaneGeometry(this.floorSize * 2, this.floorSize * 2);
        const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = Math.PI / 2;
        floor.position.y = -1;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // 馬の作成
        this.horse = this.createHorse();
        this.scene.add(this.horse);

        // ジャック・オー・ランタンをランダムに配置
        this.placeJackOLanterns(15);

        // 枯れた木を配置
        this.placeSpookyTrees(8);
    }

    // 馬の作成関数
    private createHorse = () => {
        const horseGroup = new THREE.Group();
        const horseColor = 0x3D2D1B;
        const horseMaterial = new THREE.MeshStandardMaterial({ color: horseColor });

        // 全体を大きくする
        const scaleFactor = 1.2;

        // 体
        const bodyGeometry = new THREE.BoxGeometry(2.0 * scaleFactor, 1.0 * scaleFactor, 0.8 * scaleFactor);
        const body = new THREE.Mesh(bodyGeometry, horseMaterial);
        body.castShadow = true;
        horseGroup.add(body);

        // 首
        const neckGeometry = new THREE.BoxGeometry(0.5 * scaleFactor, 1.0 * scaleFactor, 0.5 * scaleFactor);
        const neck = new THREE.Mesh(neckGeometry, horseMaterial);
        neck.position.set(0.75 * scaleFactor, 0.75 * scaleFactor, 0);
        neck.castShadow = true;
        horseGroup.add(neck);

        // 懐中電灯
        const flashlight = new THREE.PointLight(0xFFFFFF, 2, 5 * scaleFactor);
        flashlight.position.set(0.5 * scaleFactor, -0.3 * scaleFactor, 0);
        neck.add(flashlight);

        // 頭
        const headGeometry = new THREE.BoxGeometry(0.8 * scaleFactor, 0.6 * scaleFactor, 0.6 * scaleFactor);
        const head = new THREE.Mesh(headGeometry, horseMaterial);
        head.position.set(0.3 * scaleFactor, 0.8 * scaleFactor, 0);
        head.castShadow = true;
        neck.add(head);

        // 耳
        const earGeometry = new THREE.BoxGeometry(0.15 * scaleFactor, 0.3 * scaleFactor, 0.1 * scaleFactor);
        const earMaterial = new THREE.MeshStandardMaterial({ color: horseColor });
        const earLeft = new THREE.Mesh(earGeometry, earMaterial);
        earLeft.position.set(0.25 * scaleFactor, 0.4 * scaleFactor, 0.2 * scaleFactor);
        earLeft.castShadow = true;
        head.add(earLeft);
        const earRight = new THREE.Mesh(earGeometry, earMaterial);
        earRight.position.set(0.25 * scaleFactor, 0.4 * scaleFactor, -0.2 * scaleFactor);
        earRight.castShadow = true;
        head.add(earRight);

        // 鼻先
        const snoutGeometry = new THREE.BoxGeometry(0.3 * scaleFactor, 0.2 * scaleFactor, 0.2 * scaleFactor);
        const snoutMaterial = new THREE.MeshStandardMaterial({ color: 0x5D4B39 });
        const snout = new THREE.Mesh(snoutGeometry, snoutMaterial);
        snout.position.set(0.5 * scaleFactor, -0.1 * scaleFactor, 0);
        snout.castShadow = true;
        head.add(snout);

        // 目
        const eyeGeometry = new THREE.SphereGeometry(0.08 * scaleFactor, 16, 16);
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eyeLeft.position.set(0.35 * scaleFactor, 0.15 * scaleFactor, 0.25 * scaleFactor);
        eyeLeft.castShadow = true;
        head.add(eyeLeft);

        const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
        eyeRight.position.set(0.35 * scaleFactor, 0.15 * scaleFactor, -0.25 * scaleFactor);
        eyeRight.castShadow = true;
        head.add(eyeRight);

        // 脚
        const legGeometry = new THREE.BoxGeometry(0.3 * scaleFactor, 1.5 * scaleFactor, 0.3 * scaleFactor);
        const legMaterial = new THREE.MeshStandardMaterial({ color: horseColor });

        const backLegLeft = new THREE.Mesh(legGeometry, legMaterial);
        backLegLeft.position.set(-0.7 * scaleFactor, -1.25 * scaleFactor, 0.3 * scaleFactor);
        backLegLeft.castShadow = true;
        horseGroup.add(backLegLeft);

        const backLegRight = new THREE.Mesh(legGeometry, legMaterial);
        backLegRight.position.set(-0.7 * scaleFactor, -1.25 * scaleFactor, -0.3 * scaleFactor);
        backLegRight.castShadow = true;
        horseGroup.add(backLegRight);

        const frontLegLeft = new THREE.Mesh(legGeometry, legMaterial);
        frontLegLeft.position.set(0.7 * scaleFactor, -1.25 * scaleFactor, 0.3 * scaleFactor);
        frontLegLeft.castShadow = true;
        horseGroup.add(frontLegLeft);

        const frontLegRight = new THREE.Mesh(legGeometry, legMaterial);
        frontLegRight.position.set(0.7 * scaleFactor, -1.25 * scaleFactor, -0.3 * scaleFactor);
        frontLegRight.castShadow = true;
        horseGroup.add(frontLegRight);

        // しっぽ
        const tailGeometry = new THREE.CylinderGeometry(0.1 * scaleFactor, 0.2 * scaleFactor, 0.8 * scaleFactor, 8);
        const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-1.1 * scaleFactor, 0, 0);
        tail.rotation.x = Math.PI / 4;
        tail.castShadow = true;
        horseGroup.add(tail);
        // 馬の脚が床を貫通しないよう調整
        horseGroup.position.y = (1.25 * scaleFactor) - 1 + 0.9; 

        return horseGroup;
    }

    // ジャック・オー・ランタンの作成関数
    private createJackOLantern = () => {
        const lanternGroup = new THREE.Group();

        // 全体を大きく
        const scaleFactor = 1.0 / 0.7;

        const pumpkinGeometry = new THREE.SphereGeometry(0.7 * scaleFactor, 24, 24);
        const pumpkinMaterial = new THREE.MeshStandardMaterial({ color: 0xFF7F00 });
        const pumpkin = new THREE.Mesh(pumpkinGeometry, pumpkinMaterial);
        pumpkin.scale.x = 1.3;
        pumpkin.castShadow = true;
        lanternGroup.add(pumpkin);

        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

        // ランダムな目の形状 (丸目、三角目)
        const eyeShape = Math.random() > 0.5 ? 'circle' : 'triangle';
        const eyeSize = 0.2 * scaleFactor; 
        const eyePositionY = 0.2 * scaleFactor;
        const eyeOffset = 0.25 * scaleFactor;

        if (eyeShape === 'circle') {
            const eyeGeometry = new THREE.SphereGeometry(eyeSize / 2, 16, 16);
            const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eyeLeft.position.set(-eyeOffset, eyePositionY, 0.7 * scaleFactor);
            lanternGroup.add(eyeLeft);

            const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eyeRight.position.set(eyeOffset, eyePositionY, 0.7 * scaleFactor);
            lanternGroup.add(eyeRight);
        } else { // 'triangle'
            const eyeGeometry = new THREE.ConeGeometry(eyeSize / 2, eyeSize, 3);
            eyeGeometry.rotateX(-Math.PI / 2);
            const eyeLeft = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eyeLeft.position.set(-eyeOffset, eyePositionY, 0.7 * scaleFactor);
            eyeLeft.rotation.z = Math.random() * Math.PI * 2;
            lanternGroup.add(eyeLeft);

            const eyeRight = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eyeRight.position.set(eyeOffset, eyePositionY, 0.7 * scaleFactor);
            eyeRight.rotation.z = Math.random() * Math.PI * 2;
            lanternGroup.add(eyeRight);
        }

        // ランダムな口の形状 (笑顔、への字)
        const mouthType = Math.random() > 0.5 ? 'smile' : 'frown';
        const mouthPositionY = -0.2 * scaleFactor;
        const mouthPositionZ = 0.71 * scaleFactor;
        const mouthWidth = 0.25 * scaleFactor;
        const mouthHeight = 0.1 * scaleFactor;
        const mouthDepth = 0.1 * scaleFactor;
        const mouthSegments = 3 + Math.floor(Math.random() * 2);

        if (mouthType === 'smile') {
            for (let i = 0; i < mouthSegments; i++) {
                const angle = (i / (mouthSegments - 1) - 0.5) * Math.PI / 3;
                const x = Math.sin(angle) * mouthWidth * 1.5;
                const y = Math.cos(angle) * mouthHeight - mouthHeight;
                const segment = new THREE.Mesh(new THREE.BoxGeometry(mouthWidth / (mouthSegments - 1) * 0.8, mouthHeight, mouthDepth), mouthMaterial);
                segment.position.set(x, mouthPositionY + y, mouthPositionZ);
                segment.rotation.z = angle;
                lanternGroup.add(segment);
            }
        } else { // 'frown'
            for (let i = 0; i < mouthSegments; i++) {
                const segment = new THREE.Mesh(new THREE.BoxGeometry(mouthWidth / (mouthSegments - 1) * 0.8, mouthHeight, mouthDepth), mouthMaterial);
                segment.position.set((i / (mouthSegments - 1) - 0.5) * mouthWidth, mouthPositionY, mouthPositionZ);
                lanternGroup.add(segment);
            }
        }

        const stemGeometry = new THREE.CylinderGeometry(0.1 * scaleFactor, 0.15 * scaleFactor, 0.3 * scaleFactor, 8);
        const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.8 * scaleFactor;
        stem.castShadow = true;
        lanternGroup.add(stem);

        const light = new THREE.PointLight(0xFFD700, 0.5, 10 * scaleFactor);
        light.position.set(0, 0, 0);
        lanternGroup.add(light);

        return lanternGroup;
    }

    // ジャック・オー・ランタンの配置関数
    private placeJackOLanterns = (num: number) => {
        const scaleFactor = 1.0 / 0.7;
        const lanternHalfHeight = 0.77 * scaleFactor;

        // 上下運動の振幅
        const amplitude = 0.5; 

        for (let i = 0; i < num; i++) {
            const lantern = this.createJackOLantern();
            lantern.position.x = (Math.random() - 0.5) * this.floorSize * 2;
            lantern.position.z = (Math.random() - 0.5) * this.floorSize * 2;
            
            lantern.position.y = (-1 + lanternHalfHeight + amplitude) + 0.9; 

            lantern.rotation.y += Math.random() * Math.PI; // ランダムな向きに回転

            this.scene.add(lantern);
            this.jackOLanterns.push(lantern);
        }
    }

    // 不気味な枯れた木の作成
    private createSpookyTree = () => {
        const treeGroup = new THREE.Group();
        const trunkColor = 0x000000; // 黒
        const branchColor = 0x111111; // 枝は少しだけ明るい黒
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: trunkColor });
        const branchMaterial = new THREE.MeshStandardMaterial({ color: branchColor });

        // 全体を大きく
        const scaleFactor = 1.5;

        // 幹
        const trunkGeometry = new THREE.CylinderGeometry(0.4 * scaleFactor, 0.7 * scaleFactor, 6 * scaleFactor, 8); // 太さと高さを調整
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2 * scaleFactor; // 地面から生えるように
        trunk.castShadow = true;
        treeGroup.add(trunk);

        // 枝の作成関数
        const createBranch = (parent: THREE.Object3D, radiusTop: number, radiusBottom: number, height: number, posX: number, posY: number, posZ: number, rotZ: number, rotY: number = 0) => {
            const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 6); // 細い円柱
            const branch = new THREE.Mesh(geometry, branchMaterial);
            branch.position.set(posX, posY, posZ);
            branch.rotation.z = rotZ;
            branch.rotation.y = rotY;
            branch.castShadow = true;
            parent.add(branch);
            return branch;
        };

        // 枝1
        const mainBranch1 = createBranch(trunk, 0.2 * scaleFactor, 0.3 * scaleFactor, 3 * scaleFactor, 0.5 * scaleFactor, 2.5 * scaleFactor, 0, Math.PI / 4, 0);

        // 枝2
        const mainBranch2 = createBranch(trunk, 0.2 * scaleFactor, 0.3 * scaleFactor, 2.5 * scaleFactor, -0.6 * scaleFactor, 2.8 * scaleFactor, 0, -Math.PI / 5, 0);

        // 枝3
        const mainBranch3 = createBranch(trunk, 0.15 * scaleFactor, 0.25 * scaleFactor, 2.8 * scaleFactor, 0, 2.2 * scaleFactor, -0.6 * scaleFactor, -Math.PI / 6, Math.PI / 2);

        // 細い枝
        const thinBranch1 = createBranch(mainBranch1, 0.1 * scaleFactor, 0.15 * scaleFactor, 2 * scaleFactor, 0.8 * scaleFactor, 1.5 * scaleFactor, 0, -Math.PI / 3, 0);
        const thinBranch2 = createBranch(mainBranch1, 0.08 * scaleFactor, 0.12 * scaleFactor, 1.5 * scaleFactor, 0.6 * scaleFactor, 1.0 * scaleFactor, 0, Math.PI / 5, Math.PI / 4);

        const thinBranch3 = createBranch(mainBranch2, 0.1 * scaleFactor, 0.15 * scaleFactor, 1.8 * scaleFactor, -0.7 * scaleFactor, 1.2 * scaleFactor, 0, Math.PI / 3, 0);
        const thinBranch4 = createBranch(mainBranch2, 0.08 * scaleFactor, 0.12 * scaleFactor, 1.3 * scaleFactor, -0.5 * scaleFactor, 0.8 * scaleFactor, 0, -Math.PI / 6, -Math.PI / 4);

        const thinBranch5 = createBranch(mainBranch3, 0.08 * scaleFactor, 0.12 * scaleFactor, 1.5 * scaleFactor, 0.5 * scaleFactor, 1.0 * scaleFactor, 0, Math.PI / 4, 0);


        treeGroup.position.y = -1;

        return treeGroup;
    }

    // 不気味な枯れた木の配置関数
    private placeSpookyTrees = (num: number) => {
        for (let i = 0; i < num; i++) {
            const tree = this.createSpookyTree();

            // ランダムな位置
            tree.position.x = (Math.random() - 0.5) * this.floorSize * 2;
            tree.position.z = (Math.random() - 0.5) * this.floorSize * 2;
            tree.position.y = -1; // 地面の基準に合わせる

            // ランダムな回転 (枯れ木の向き)
            tree.rotation.y = Math.random() * Math.PI * 2;

            this.scene.add(tree);
        }
    }

    // Bezier曲線関数
    private bezier = (p0: THREE.Vector3, p1: THREE.Vector3,
        p2: THREE.Vector3, p3: THREE.Vector3, t: number): (THREE.Vector3) => {
        const mt = 1.0 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        const t2 = t * t;
        const t3 = t2 * t;

        const result = new THREE.Vector3();
        result.x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
        result.y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;
        result.z = mt3 * p0.z + 3 * mt2 * t * p1.z + 3 * mt * t2 * p2.z + t3 * p3.z;
        return result;
    }

    // 馬のアニメーションロジック:Bezier曲線
    private animateHorse = () => {
        if (!this.horse) return;

        const delta = this.clock.getDelta();
        this.t += delta / this.pathDuration;

        if (this.t >= 1.0) {
            this.t -= 1.0;
            this.seg = (this.seg + 1) % (this.points.length / 4);
        }

        // セグメントの制御点を取得
        const p0 = this.points[this.seg * 4 + 0];
        const p1 = this.points[this.seg * 4 + 1];
        const p2 = this.points[this.seg * 4 + 2];
        const p3 = this.points[this.seg * 4 + 3];

        // Bezier曲線上の位置を計算
        const currentPos = this.bezier(p0, p1, p2, p3, this.t);

        let lookAtT = Math.min(this.t + 0.001, 1.0);
        let lookAtNextSeg = this.seg;
        if (lookAtT >= 1.0) {
            lookAtT = 0.001;
            lookAtNextSeg = (this.seg + 1) % (this.points.length / 4);
        }

        const nextP0 = this.points[lookAtNextSeg * 4 + 0];
        const nextP1 = this.points[lookAtNextSeg * 4 + 1];
        const nextP2 = this.points[lookAtNextSeg * 4 + 2];
        const nextP3 = this.points[lookAtNextSeg * 4 + 3];

        const targetPos = this.bezier(nextP0, nextP1, nextP2, nextP3, lookAtT);

        // 馬のY座標は地面に固定
        this.horse.position.x = currentPos.x;
        this.horse.position.z = currentPos.z;

        // 馬の頭が進行方向を向くようにlookAtを使用
        this.horse.lookAt(new THREE.Vector3(targetPos.x, this.horse.position.y, targetPos.z));
    }

    // ジャック・オー・ランタンのアニメーションロジック
    private animateJackOLanterns = (time: DOMHighResTimeStamp) => {
        const amplitude = 0.5; // 上下運動の振幅
        const frequency = 0.002; // 上下運動の速さ

        const scaleFactor = 1.0 / 0.7;
        const lanternHalfHeight = 0.77 * scaleFactor;

        this.jackOLanterns.forEach((lantern, index) => {
            lantern.position.y = (-1 + lanternHalfHeight + amplitude) + 0.9 + Math.sin(time * frequency + index * 0.5) * amplitude;
        });
    }
}

window.addEventListener("DOMContentLoaded", init);

function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(window.innerWidth * 0.9, window.innerHeight * 0.9, new THREE.Vector3(0, 20, 30)); // カメラを少し高く、後ろに引く
    document.body.appendChild(viewport);
}