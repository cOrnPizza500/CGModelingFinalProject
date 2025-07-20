/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");


class ThreeJSContainer {
    scene;
    light;
    horse;
    jackOLanterns = [];
    // パスアニメーション用のプロパティ
    clock = new three__WEBPACK_IMPORTED_MODULE_1__.Clock();
    t = 0;
    seg = 0;
    // Bezier曲線の制御点
    points = [
        // Segment 1
        new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-15, 0, 0),
        new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-10, 0, 15),
        new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(10, 0, 15),
        new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(15, 0, 0),
        // Segment 2
        new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(15, 0, 0),
        // P1_s2: P0_s2 + (P0_s2 - P2_s1) = (15,0,0) + ((15,0,0) - (10,0,15)) = (20,0,-15)
        new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(20, 0, -15),
        // P2_s2: P3_s2 + (P3_s2 - P1_s1) = (-15,0,0) + ((-15,0,0) - (-10,0,15)) = (-20,0,-15)
        new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-20, 0, -15),
        new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-15, 0, 0)
    ];
    pathDuration = 12;
    floorSize = 25; // 床のサイズ
    constructor() {
    }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x000000));
        renderer.shadowMap.enabled = true;
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        const render = (time) => {
            orbitControls.update();
            this.animateHorse(); // 馬のアニメーション
            this.animateJackOLanterns(time);
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.scene.fog = new three__WEBPACK_IMPORTED_MODULE_1__.Fog(0x333333, 20, 100);
        // ライトの設定
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_1__.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff, 0.6);
        this.light.position.set(5, 10, 5);
        this.light.castShadow = true;
        this.scene.add(this.light);
        // 床の作成
        const floorGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(this.floorSize * 2, this.floorSize * 2);
        const floorMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x8B4513, side: three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide });
        const floor = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(floorGeometry, floorMaterial);
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
    };
    // 馬の作成関数
    createHorse = () => {
        const horseGroup = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
        const horseColor = 0x3D2D1B;
        const horseMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: horseColor });
        // 全体を大きくする
        const scaleFactor = 1.2;
        // 体
        const bodyGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(2.0 * scaleFactor, 1.0 * scaleFactor, 0.8 * scaleFactor);
        const body = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(bodyGeometry, horseMaterial);
        body.castShadow = true;
        horseGroup.add(body);
        // 首
        const neckGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.5 * scaleFactor, 1.0 * scaleFactor, 0.5 * scaleFactor);
        const neck = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(neckGeometry, horseMaterial);
        neck.position.set(0.75 * scaleFactor, 0.75 * scaleFactor, 0);
        neck.castShadow = true;
        horseGroup.add(neck);
        // 懐中電灯
        const flashlight = new three__WEBPACK_IMPORTED_MODULE_1__.PointLight(0xFFFFFF, 2, 5 * scaleFactor);
        flashlight.position.set(0.5 * scaleFactor, -0.3 * scaleFactor, 0);
        neck.add(flashlight);
        // 頭
        const headGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.8 * scaleFactor, 0.6 * scaleFactor, 0.6 * scaleFactor);
        const head = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(headGeometry, horseMaterial);
        head.position.set(0.3 * scaleFactor, 0.8 * scaleFactor, 0);
        head.castShadow = true;
        neck.add(head);
        // 耳
        const earGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.15 * scaleFactor, 0.3 * scaleFactor, 0.1 * scaleFactor);
        const earMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: horseColor });
        const earLeft = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(earGeometry, earMaterial);
        earLeft.position.set(0.25 * scaleFactor, 0.4 * scaleFactor, 0.2 * scaleFactor);
        earLeft.castShadow = true;
        head.add(earLeft);
        const earRight = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(earGeometry, earMaterial);
        earRight.position.set(0.25 * scaleFactor, 0.4 * scaleFactor, -0.2 * scaleFactor);
        earRight.castShadow = true;
        head.add(earRight);
        // 鼻先
        const snoutGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.3 * scaleFactor, 0.2 * scaleFactor, 0.2 * scaleFactor);
        const snoutMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x5D4B39 });
        const snout = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(snoutGeometry, snoutMaterial);
        snout.position.set(0.5 * scaleFactor, -0.1 * scaleFactor, 0);
        snout.castShadow = true;
        head.add(snout);
        // 目
        const eyeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(0.08 * scaleFactor, 16, 16);
        const eyeMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x000000 });
        const eyeLeft = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(eyeGeometry, eyeMaterial);
        eyeLeft.position.set(0.35 * scaleFactor, 0.15 * scaleFactor, 0.25 * scaleFactor);
        eyeLeft.castShadow = true;
        head.add(eyeLeft);
        const eyeRight = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(eyeGeometry, eyeMaterial);
        eyeRight.position.set(0.35 * scaleFactor, 0.15 * scaleFactor, -0.25 * scaleFactor);
        eyeRight.castShadow = true;
        head.add(eyeRight);
        // 脚
        const legGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(0.3 * scaleFactor, 1.5 * scaleFactor, 0.3 * scaleFactor);
        const legMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: horseColor });
        const backLegLeft = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(legGeometry, legMaterial);
        backLegLeft.position.set(-0.7 * scaleFactor, -1.25 * scaleFactor, 0.3 * scaleFactor);
        backLegLeft.castShadow = true;
        horseGroup.add(backLegLeft);
        const backLegRight = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(legGeometry, legMaterial);
        backLegRight.position.set(-0.7 * scaleFactor, -1.25 * scaleFactor, -0.3 * scaleFactor);
        backLegRight.castShadow = true;
        horseGroup.add(backLegRight);
        const frontLegLeft = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(legGeometry, legMaterial);
        frontLegLeft.position.set(0.7 * scaleFactor, -1.25 * scaleFactor, 0.3 * scaleFactor);
        frontLegLeft.castShadow = true;
        horseGroup.add(frontLegLeft);
        const frontLegRight = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(legGeometry, legMaterial);
        frontLegRight.position.set(0.7 * scaleFactor, -1.25 * scaleFactor, -0.3 * scaleFactor);
        frontLegRight.castShadow = true;
        horseGroup.add(frontLegRight);
        // しっぽ
        const tailGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(0.1 * scaleFactor, 0.2 * scaleFactor, 0.8 * scaleFactor, 8);
        const tailMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x696969 });
        const tail = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-1.1 * scaleFactor, 0, 0);
        tail.rotation.x = Math.PI / 4;
        tail.castShadow = true;
        horseGroup.add(tail);
        // 馬の脚が床を貫通しないよう調整
        horseGroup.position.y = (1.25 * scaleFactor) - 1 + 0.9;
        return horseGroup;
    };
    // ジャック・オー・ランタンの作成関数
    createJackOLantern = () => {
        const lanternGroup = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
        // 全体を大きく
        const scaleFactor = 1.0 / 0.7;
        const pumpkinGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(0.7 * scaleFactor, 24, 24);
        const pumpkinMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0xFF7F00 });
        const pumpkin = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(pumpkinGeometry, pumpkinMaterial);
        pumpkin.scale.x = 1.3;
        pumpkin.castShadow = true;
        lanternGroup.add(pumpkin);
        const eyeMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x000000 });
        const mouthMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x000000 });
        // ランダムな目の形状 (丸目、三角目)
        const eyeShape = Math.random() > 0.5 ? 'circle' : 'triangle';
        const eyeSize = 0.2 * scaleFactor;
        const eyePositionY = 0.2 * scaleFactor;
        const eyeOffset = 0.25 * scaleFactor;
        if (eyeShape === 'circle') {
            const eyeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.SphereGeometry(eyeSize / 2, 16, 16);
            const eyeLeft = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(eyeGeometry, eyeMaterial);
            eyeLeft.position.set(-eyeOffset, eyePositionY, 0.7 * scaleFactor);
            lanternGroup.add(eyeLeft);
            const eyeRight = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(eyeGeometry, eyeMaterial);
            eyeRight.position.set(eyeOffset, eyePositionY, 0.7 * scaleFactor);
            lanternGroup.add(eyeRight);
        }
        else { // 'triangle'
            const eyeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.ConeGeometry(eyeSize / 2, eyeSize, 3);
            eyeGeometry.rotateX(-Math.PI / 2);
            const eyeLeft = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(eyeGeometry, eyeMaterial);
            eyeLeft.position.set(-eyeOffset, eyePositionY, 0.7 * scaleFactor);
            eyeLeft.rotation.z = Math.random() * Math.PI * 2;
            lanternGroup.add(eyeLeft);
            const eyeRight = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(eyeGeometry, eyeMaterial);
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
                const segment = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(mouthWidth / (mouthSegments - 1) * 0.8, mouthHeight, mouthDepth), mouthMaterial);
                segment.position.set(x, mouthPositionY + y, mouthPositionZ);
                segment.rotation.z = angle;
                lanternGroup.add(segment);
            }
        }
        else { // 'frown'
            for (let i = 0; i < mouthSegments; i++) {
                const segment = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(mouthWidth / (mouthSegments - 1) * 0.8, mouthHeight, mouthDepth), mouthMaterial);
                segment.position.set((i / (mouthSegments - 1) - 0.5) * mouthWidth, mouthPositionY, mouthPositionZ);
                lanternGroup.add(segment);
            }
        }
        const stemGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(0.1 * scaleFactor, 0.15 * scaleFactor, 0.3 * scaleFactor, 8);
        const stemMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: 0x228B22 });
        const stem = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(stemGeometry, stemMaterial);
        stem.position.y = 0.8 * scaleFactor;
        stem.castShadow = true;
        lanternGroup.add(stem);
        const light = new three__WEBPACK_IMPORTED_MODULE_1__.PointLight(0xFFD700, 0.5, 10 * scaleFactor);
        light.position.set(0, 0, 0);
        lanternGroup.add(light);
        return lanternGroup;
    };
    // ジャック・オー・ランタンの配置関数
    placeJackOLanterns = (num) => {
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
    };
    // 不気味な枯れた木の作成
    createSpookyTree = () => {
        const treeGroup = new three__WEBPACK_IMPORTED_MODULE_1__.Group();
        const trunkColor = 0x000000; // 黒
        const branchColor = 0x111111; // 枝は少しだけ明るい黒
        const trunkMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: trunkColor });
        const branchMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshStandardMaterial({ color: branchColor });
        // 全体を大きく
        const scaleFactor = 1.5;
        // 幹
        const trunkGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(0.4 * scaleFactor, 0.7 * scaleFactor, 6 * scaleFactor, 8); // 太さと高さを調整
        const trunk = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2 * scaleFactor; // 地面から生えるように
        trunk.castShadow = true;
        treeGroup.add(trunk);
        // 枝の作成関数
        const createBranch = (parent, radiusTop, radiusBottom, height, posX, posY, posZ, rotZ, rotY = 0) => {
            const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.CylinderGeometry(radiusTop, radiusBottom, height, 6); // 細い円柱
            const branch = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, branchMaterial);
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
    };
    // 不気味な枯れた木の配置関数
    placeSpookyTrees = (num) => {
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
    };
    // Bezier曲線関数
    bezier = (p0, p1, p2, p3, t) => {
        const mt = 1.0 - t;
        const mt2 = mt * mt;
        const mt3 = mt2 * mt;
        const t2 = t * t;
        const t3 = t2 * t;
        const result = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3();
        result.x = mt3 * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t3 * p3.x;
        result.y = mt3 * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t3 * p3.y;
        result.z = mt3 * p0.z + 3 * mt2 * t * p1.z + 3 * mt * t2 * p2.z + t3 * p3.z;
        return result;
    };
    // 馬のアニメーションロジック:Bezier曲線
    animateHorse = () => {
        if (!this.horse)
            return;
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
        this.horse.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(targetPos.x, this.horse.position.y, targetPos.z));
    };
    // ジャック・オー・ランタンのアニメーションロジック
    animateJackOLanterns = (time) => {
        const amplitude = 0.5; // 上下運動の振幅
        const frequency = 0.002; // 上下運動の速さ
        const scaleFactor = 1.0 / 0.7;
        const lanternHalfHeight = 0.77 * scaleFactor;
        this.jackOLanterns.forEach((lantern, index) => {
            lantern.position.y = (-1 + lanternHalfHeight + amplitude) + 0.9 + Math.sin(time * frequency + index * 0.5) * amplitude;
        });
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(window.innerWidth * 0.9, window.innerHeight * 0.9, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 20, 30)); // カメラを少し高く、後ろに引く
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_three_examples_jsm_controls_OrbitControls_js"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUk7UUFDSixNQUFNLFdBQVcsR0FBRyxJQUFJLDhDQUFpQixDQUFDLEdBQUcsR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDbkcsTUFBTSxXQUFXLEdBQUcsSUFBSSx1REFBMEIsQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBRTFFLE1BQU0sV0FBVyxHQUFHLElBQUksdUNBQVUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDN0QsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUMsSUFBSSxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDckYsV0FBVyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDOUIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1QixNQUFNLFlBQVksR0FBRyxJQUFJLHVDQUFVLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzlELFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLFdBQVcsRUFBRSxDQUFDLElBQUksR0FBRyxXQUFXLEVBQUUsQ0FBQyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUM7UUFDdkYsWUFBWSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDL0IsVUFBVSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU3QixNQUFNLFlBQVksR0FBRyxJQUFJLHVDQUFVLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzlELFlBQVksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEdBQUcsV0FBVyxFQUFFLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQztRQUNyRixZQUFZLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUMvQixVQUFVLENB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Q0FBQyxLQUFLLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV4SixLQUFLO1FBQ0wsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLEdBQUcsR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU1SixLQUFLO1FBQ0wsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLEdBQUcsV0FBVyxFQUFFLElBQUksR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsR0FBRyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRXhLLE1BQU07UUFDTixNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxXQUFXLEVBQUUsSUFBSSxHQUFHLFdBQVcsRUFBRSxDQUFDLEdBQUcsV0FBVyxFQUFFLEdBQUcsR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoSyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksR0FBRyxXQUFXLEVBQUUsSUFBSSxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLEdBQUcsR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUU1SyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxXQUFXLEVBQUUsSUFBSSxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsSyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksR0FBRyxXQUFXLEVBQUUsSUFBSSxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUMsR0FBRyxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUUvSyxNQUFNLFdBQVcsR0FBRyxZQUFZLENBQUMsV0FBVyxFQUFFLElBQUksR0FBRyxXQUFXLEVBQUUsSUFBSSxHQUFHLFdBQVcsRUFBRSxHQUFHLEdBQUcsV0FBVyxFQUFFLEdBQUcsR0FBRyxXQUFXLEVBQUUsR0FBRyxHQUFHLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFHbEssU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFMUIsT0FBTyxTQUFTLENBQUM7SUFDckIsQ0FBQztJQUVELGdCQUFnQjtJQUNSLGdCQUFnQixHQUFHLENBQUMsR0FBVyxF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O1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XHJcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcclxuXHJcbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xyXG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XHJcbiAgICBwcml2YXRlIGxpZ2h0OiBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0O1xyXG4gICAgcHJpdmF0ZSBob3JzZTogVEhSRUUuR3JvdXA7XHJcbiAgICBwcml2YXRlIGphY2tPTGFudGVybnM6IFRIUkVFLkdyb3VwW10gPSBbXTtcclxuXHJcbiAgICAvLyDjg5HjgrnjgqLjg4vjg6Hjg7zjgrfjg6fjg7PnlKjjga7jg5fjg63jg5Hjg4bjgqNcclxuICAgIHByaXZhdGUgY2xvY2s6IFRIUkVFLkNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XHJcbiAgICBwcml2YXRlIHQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHNlZzogbnVtYmVyID0gMDtcclxuXHJcbiAgICAvLyBCZXppZXLmm7Lnt5rjga7liLblvqHngrlcclxuICAgIHByaXZhdGUgcG9pbnRzOiBUSFJFRS5WZWN0b3IzW10gPSBbXHJcbiAgICAgICAgLy8gU2VnbWVudCAxXHJcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoLTE1LCAwLCAwKSxcclxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMTAsIDAsIDE1KSxcclxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygxMCwgMCwgMTUpLFxyXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKDE1LCAwLCAwKSxcclxuXHJcbiAgICAgICAgLy8gU2VnbWVudCAyXHJcbiAgICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoMTUsIDAsIDApLFxyXG4gICAgICAgIC8vIFAxX3MyOiBQMF9zMiArIChQMF9zMiAtIFAyX3MxKSA9ICgxNSwwLDApICsgKCgxNSwwLDApIC0gKDEwLDAsMTUpKSA9ICgyMCwwLC0xNSlcclxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygyMCwgMCwgLTE1KSxcclxuICAgICAgICAvLyBQMl9zMjogUDNfczIgKyAoUDNfczIgLSBQMV9zMSkgPSAoLTE1LDAsMCkgKyAoKC0xNSwwLDApIC0gKC0xMCwwLDE1KSkgPSAoLTIwLDAsLTE1KVxyXG4gICAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC0yMCwgMCwgLTE1KSxcclxuICAgICAgICBuZXcgVEhSRUUuVmVjdG9yMygtMTUsIDAsIDApXHJcbiAgICBdO1xyXG5cclxuICAgIHByaXZhdGUgcGF0aER1cmF0aW9uOiBudW1iZXIgPSAxMjtcclxuICAgIHByaXZhdGUgZmxvb3JTaXplOiBudW1iZXIgPSAyNTsgLy8g5bqK44Gu44K144Kk44K6XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XHJcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDAwMDAwMCkpO1xyXG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcclxuICAgICAgICBjYW1lcmEucG9zaXRpb24uY29weShjYW1lcmFQb3MpO1xyXG4gICAgICAgIGNhbWVyYS5sb29rQXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xyXG5cclxuICAgICAgICBjb25zdCBvcmJpdENvbnRyb2xzID0gbmV3IE9yYml0Q29udHJvbHMoY2FtZXJhLCByZW5kZXJlci5kb21FbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xyXG5cclxuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcclxuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0ZUhvcnNlKCk7IC8vIOmmrOOBruOCouODi+ODoeODvOOCt+ODp+ODs1xyXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGVKYWNrT0xhbnRlcm5zKHRpbWUpO1xyXG5cclxuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XHJcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcclxuXHJcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5jc3NGbG9hdCA9IFwibGVmdFwiO1xyXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XHJcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKDB4MzMzMzMzLCAyMCwgMTAwKTtcclxuXHJcbiAgICAgICAgLy8g44Op44Kk44OI44Gu6Kit5a6aXHJcbiAgICAgICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDQwNDA0MCwgMC40KTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xyXG5cclxuICAgICAgICB0aGlzLmxpZ2h0ID0gbmV3IFRIUkVFLkRpcmVjdGlvbmFsTGlnaHQoMHhmZmZmZmYsIDAuNik7XHJcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQoNSwgMTAsIDUpO1xyXG4gICAgICAgIHRoaXMubGlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XHJcblxyXG4gICAgICAgIC8vIOW6iuOBruS9nOaIkFxyXG4gICAgICAgIGNvbnN0IGZsb29yR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSh0aGlzLmZsb29yU2l6ZSAqIDIsIHRoaXMuZmxvb3JTaXplICogMik7XHJcbiAgICAgICAgY29uc3QgZmxvb3JNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDhCNDUxMywgc2lkZTogVEhSRUUuRG91YmxlU2lkZSB9KTtcclxuICAgICAgICBjb25zdCBmbG9vciA9IG5ldyBUSFJFRS5NZXNoKGZsb29yR2VvbWV0cnksIGZsb29yTWF0ZXJpYWwpO1xyXG4gICAgICAgIGZsb29yLnJvdGF0aW9uLnggPSBNYXRoLlBJIC8gMjtcclxuICAgICAgICBmbG9vci5wb3NpdGlvbi55ID0gLTE7XHJcbiAgICAgICAgZmxvb3IucmVjZWl2ZVNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZmxvb3IpO1xyXG5cclxuICAgICAgICAvLyDppqzjga7kvZzmiJBcclxuICAgICAgICB0aGlzLmhvcnNlID0gdGhpcy5jcmVhdGVIb3JzZSgpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuaG9yc2UpO1xyXG5cclxuICAgICAgICAvLyDjgrjjg6Pjg4Pjgq/jg7vjgqrjg7zjg7vjg6njg7Pjgr/jg7PjgpLjg6njg7Pjg4Djg6DjgavphY3nva5cclxuICAgICAgICB0aGlzLnBsYWNlSmFja09MYW50ZXJucygxNSk7XHJcblxyXG4gICAgICAgIC8vIOaer+OCjOOBn+acqOOCkumFjee9rlxyXG4gICAgICAgIHRoaXMucGxhY2VTcG9va3lUcmVlcyg4KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDppqzjga7kvZzmiJDplqLmlbBcclxuICAgIHByaXZhdGUgY3JlYXRlSG9yc2UgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaG9yc2VHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIGNvbnN0IGhvcnNlQ29sb3IgPSAweDNEMkQxQjtcclxuICAgICAgICBjb25zdCBob3JzZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IGhvcnNlQ29sb3IgfSk7XHJcblxyXG4gICAgICAgIC8vIOWFqOS9k+OCkuWkp+OBjeOBj+OBmeOCi1xyXG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gMS4yO1xyXG5cclxuICAgICAgICAvLyDkvZNcclxuICAgICAgICBjb25zdCBib2R5R2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMi4wICogc2NhbGVGYWN0b3IsIDEuMCAqIHNjYWxlRmFjdG9yLCAwLjggKiBzY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IG5ldyBUSFJFRS5NZXNoKGJvZHlHZW9tZXRyeSwgaG9yc2VNYXRlcmlhbCk7XHJcbiAgICAgICAgYm9keS5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBob3JzZUdyb3VwLmFkZChib2R5KTtcclxuXHJcbiAgICAgICAgLy8g6aaWXHJcbiAgICAgICAgY29uc3QgbmVja0dlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuNSAqIHNjYWxlRmFjdG9yLCAxLjAgKiBzY2FsZUZhY3RvciwgMC41ICogc2NhbGVGYWN0b3IpO1xyXG4gICAgICAgIGNvbnN0IG5lY2sgPSBuZXcgVEhSRUUuTWVzaChuZWNrR2VvbWV0cnksIGhvcnNlTWF0ZXJpYWwpO1xyXG4gICAgICAgIG5lY2sucG9zaXRpb24uc2V0KDAuNzUgKiBzY2FsZUZhY3RvciwgMC43NSAqIHNjYWxlRmFjdG9yLCAwKTtcclxuICAgICAgICBuZWNrLmNhc3RTaGFkb3cgPSB0cnVlO1xyXG4gICAgICAgIGhvcnNlR3JvdXAuYWRkKG5lY2spO1xyXG5cclxuICAgICAgICAvLyDmh5DkuK3pm7vnga9cclxuICAgICAgICBjb25zdCBmbGFzaGxpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoMHhGRkZGRkYsIDIsIDUgKiBzY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgZmxhc2hsaWdodC5wb3NpdGlvbi5zZXQoMC41ICogc2NhbGVGYWN0b3IsIC0wLjMgKiBzY2FsZUZhY3RvciwgMCk7XHJcbiAgICAgICAgbmVjay5hZGQoZmxhc2hsaWdodCk7XHJcblxyXG4gICAgICAgIC8vIOmgrVxyXG4gICAgICAgIGNvbnN0IGhlYWRHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgwLjggKiBzY2FsZUZhY3RvciwgMC42ICogc2NhbGVGYWN0b3IsIDAuNiAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICBjb25zdCBoZWFkID0gbmV3IFRIUkVFLk1lc2goaGVhZEdlb21ldHJ5LCBob3JzZU1hdGVyaWFsKTtcclxuICAgICAgICBoZWFkLnBvc2l0aW9uLnNldCgwLjMgKiBzY2FsZUZhY3RvciwgMC44ICogc2NhbGVGYWN0b3IsIDApO1xyXG4gICAgICAgIGhlYWQuY2FzdFNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgbmVjay5hZGQoaGVhZCk7XHJcblxyXG4gICAgICAgIC8vIOiAs1xyXG4gICAgICAgIGNvbnN0IGVhckdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDAuMTUgKiBzY2FsZUZhY3RvciwgMC4zICogc2NhbGVGYWN0b3IsIDAuMSAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICBjb25zdCBlYXJNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiBob3JzZUNvbG9yIH0pO1xyXG4gICAgICAgIGNvbnN0IGVhckxlZnQgPSBuZXcgVEhSRUUuTWVzaChlYXJHZW9tZXRyeSwgZWFyTWF0ZXJpYWwpO1xyXG4gICAgICAgIGVhckxlZnQucG9zaXRpb24uc2V0KDAuMjUgKiBzY2FsZUZhY3RvciwgMC40ICogc2NhbGVGYWN0b3IsIDAuMiAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICBlYXJMZWZ0LmNhc3RTaGFkb3cgPSB0cnVlO1xyXG4gICAgICAgIGhlYWQuYWRkKGVhckxlZnQpO1xyXG4gICAgICAgIGNvbnN0IGVhclJpZ2h0ID0gbmV3IFRIUkVFLk1lc2goZWFyR2VvbWV0cnksIGVhck1hdGVyaWFsKTtcclxuICAgICAgICBlYXJSaWdodC5wb3NpdGlvbi5zZXQoMC4yNSAqIHNjYWxlRmFjdG9yLCAwLjQgKiBzY2FsZUZhY3RvciwgLTAuMiAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICBlYXJSaWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBoZWFkLmFkZChlYXJSaWdodCk7XHJcblxyXG4gICAgICAgIC8vIOm8u+WFiFxyXG4gICAgICAgIGNvbnN0IHNub3V0R2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoMC4zICogc2NhbGVGYWN0b3IsIDAuMiAqIHNjYWxlRmFjdG9yLCAwLjIgKiBzY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgY29uc3Qgc25vdXRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDVENEIzOSB9KTtcclxuICAgICAgICBjb25zdCBzbm91dCA9IG5ldyBUSFJFRS5NZXNoKHNub3V0R2VvbWV0cnksIHNub3V0TWF0ZXJpYWwpO1xyXG4gICAgICAgIHNub3V0LnBvc2l0aW9uLnNldCgwLjUgKiBzY2FsZUZhY3RvciwgLTAuMSAqIHNjYWxlRmFjdG9yLCAwKTtcclxuICAgICAgICBzbm91dC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBoZWFkLmFkZChzbm91dCk7XHJcblxyXG4gICAgICAgIC8vIOebrlxyXG4gICAgICAgIGNvbnN0IGV5ZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuMDggKiBzY2FsZUZhY3RvciwgMTYsIDE2KTtcclxuICAgICAgICBjb25zdCBleWVNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDAwMDAwMCB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgZXllTGVmdCA9IG5ldyBUSFJFRS5NZXNoKGV5ZUdlb21ldHJ5LCBleWVNYXRlcmlhbCk7XHJcbiAgICAgICAgZXllTGVmdC5wb3NpdGlvbi5zZXQoMC4zNSAqIHNjYWxlRmFjdG9yLCAwLjE1ICogc2NhbGVGYWN0b3IsIDAuMjUgKiBzY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgZXllTGVmdC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBoZWFkLmFkZChleWVMZWZ0KTtcclxuXHJcbiAgICAgICAgY29uc3QgZXllUmlnaHQgPSBuZXcgVEhSRUUuTWVzaChleWVHZW9tZXRyeSwgZXllTWF0ZXJpYWwpO1xyXG4gICAgICAgIGV5ZVJpZ2h0LnBvc2l0aW9uLnNldCgwLjM1ICogc2NhbGVGYWN0b3IsIDAuMTUgKiBzY2FsZUZhY3RvciwgLTAuMjUgKiBzY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgZXllUmlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgaGVhZC5hZGQoZXllUmlnaHQpO1xyXG5cclxuICAgICAgICAvLyDohJpcclxuICAgICAgICBjb25zdCBsZWdHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgwLjMgKiBzY2FsZUZhY3RvciwgMS41ICogc2NhbGVGYWN0b3IsIDAuMyAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICBjb25zdCBsZWdNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiBob3JzZUNvbG9yIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBiYWNrTGVnTGVmdCA9IG5ldyBUSFJFRS5NZXNoKGxlZ0dlb21ldHJ5LCBsZWdNYXRlcmlhbCk7XHJcbiAgICAgICAgYmFja0xlZ0xlZnQucG9zaXRpb24uc2V0KC0wLjcgKiBzY2FsZUZhY3RvciwgLTEuMjUgKiBzY2FsZUZhY3RvciwgMC4zICogc2NhbGVGYWN0b3IpO1xyXG4gICAgICAgIGJhY2tMZWdMZWZ0LmNhc3RTaGFkb3cgPSB0cnVlO1xyXG4gICAgICAgIGhvcnNlR3JvdXAuYWRkKGJhY2tMZWdMZWZ0KTtcclxuXHJcbiAgICAgICAgY29uc3QgYmFja0xlZ1JpZ2h0ID0gbmV3IFRIUkVFLk1lc2gobGVnR2VvbWV0cnksIGxlZ01hdGVyaWFsKTtcclxuICAgICAgICBiYWNrTGVnUmlnaHQucG9zaXRpb24uc2V0KC0wLjcgKiBzY2FsZUZhY3RvciwgLTEuMjUgKiBzY2FsZUZhY3RvciwgLTAuMyAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICBiYWNrTGVnUmlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgaG9yc2VHcm91cC5hZGQoYmFja0xlZ1JpZ2h0KTtcclxuXHJcbiAgICAgICAgY29uc3QgZnJvbnRMZWdMZWZ0ID0gbmV3IFRIUkVFLk1lc2gobGVnR2VvbWV0cnksIGxlZ01hdGVyaWFsKTtcclxuICAgICAgICBmcm9udExlZ0xlZnQucG9zaXRpb24uc2V0KDAuNyAqIHNjYWxlRmFjdG9yLCAtMS4yNSAqIHNjYWxlRmFjdG9yLCAwLjMgKiBzY2FsZUZhY3Rvcik7XHJcbiAgICAgICAgZnJvbnRMZWdMZWZ0LmNhc3RTaGFkb3cgPSB0cnVlO1xyXG4gICAgICAgIGhvcnNlR3JvdXAuYWRkKGZyb250TGVnTGVmdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyb250TGVnUmlnaHQgPSBuZXcgVEhSRUUuTWVzaChsZWdHZW9tZXRyeSwgbGVnTWF0ZXJpYWwpO1xyXG4gICAgICAgIGZyb250TGVnUmlnaHQucG9zaXRpb24uc2V0KDAuNyAqIHNjYWxlRmFjdG9yLCAtMS4yNSAqIHNjYWxlRmFjdG9yLCAtMC4zICogc2NhbGVGYWN0b3IpO1xyXG4gICAgICAgIGZyb250TGVnUmlnaHQuY2FzdFNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgaG9yc2VHcm91cC5hZGQoZnJvbnRMZWdSaWdodCk7XHJcblxyXG4gICAgICAgIC8vIOOBl+OBo+OBvVxyXG4gICAgICAgIGNvbnN0IHRhaWxHZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuMSAqIHNjYWxlRmFjdG9yLCAwLjIgKiBzY2FsZUZhY3RvciwgMC44ICogc2NhbGVGYWN0b3IsIDgpO1xyXG4gICAgICAgIGNvbnN0IHRhaWxNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweDY5Njk2OSB9KTtcclxuICAgICAgICBjb25zdCB0YWlsID0gbmV3IFRIUkVFLk1lc2godGFpbEdlb21ldHJ5LCB0YWlsTWF0ZXJpYWwpO1xyXG4gICAgICAgIHRhaWwucG9zaXRpb24uc2V0KC0xLjEgKiBzY2FsZUZhY3RvciwgMCwgMCk7XHJcbiAgICAgICAgdGFpbC5yb3RhdGlvbi54ID0gTWF0aC5QSSAvIDQ7XHJcbiAgICAgICAgdGFpbC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBob3JzZUdyb3VwLmFkZCh0YWlsKTtcclxuICAgICAgICAvLyDppqzjga7ohJrjgYzluorjgpLosqvpgJrjgZfjgarjgYTjgojjgYboqr/mlbRcclxuICAgICAgICBob3JzZUdyb3VwLnBvc2l0aW9uLnkgPSAoMS4yNSAqIHNjYWxlRmFjdG9yKSAtIDEgKyAwLjk7IFxyXG5cclxuICAgICAgICByZXR1cm4gaG9yc2VHcm91cDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDjgrjjg6Pjg4Pjgq/jg7vjgqrjg7zjg7vjg6njg7Pjgr/jg7Pjga7kvZzmiJDplqLmlbBcclxuICAgIHByaXZhdGUgY3JlYXRlSmFja09MYW50ZXJuID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGxhbnRlcm5Hcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG5cclxuICAgICAgICAvLyDlhajkvZPjgpLlpKfjgY3jgY9cclxuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9IDEuMCAvIDAuNztcclxuXHJcbiAgICAgICAgY29uc3QgcHVtcGtpbkdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDAuNyAqIHNjYWxlRmFjdG9yLCAyNCwgMjQpO1xyXG4gICAgICAgIGNvbnN0IHB1bXBraW5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiAweEZGN0YwMCB9KTtcclxuICAgICAgICBjb25zdCBwdW1wa2luID0gbmV3IFRIUkVFLk1lc2gocHVtcGtpbkdlb21ldHJ5LCBwdW1wa2luTWF0ZXJpYWwpO1xyXG4gICAgICAgIHB1bXBraW4uc2NhbGUueCA9IDEuMztcclxuICAgICAgICBwdW1wa2luLmNhc3RTaGFkb3cgPSB0cnVlO1xyXG4gICAgICAgIGxhbnRlcm5Hcm91cC5hZGQocHVtcGtpbik7XHJcblxyXG4gICAgICAgIGNvbnN0IGV5ZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4MDAwMDAwIH0pO1xyXG4gICAgICAgIGNvbnN0IG1vdXRoTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoeyBjb2xvcjogMHgwMDAwMDAgfSk7XHJcblxyXG4gICAgICAgIC8vIOODqeODs+ODgOODoOOBquebruOBruW9oueKtiAo5Li455uu44CB5LiJ6KeS55uuKVxyXG4gICAgICAgIGNvbnN0IGV5ZVNoYXBlID0gTWF0aC5yYW5kb20oKSA+IDAuNSA/ICdjaXJjbGUnIDogJ3RyaWFuZ2xlJztcclxuICAgICAgICBjb25zdCBleWVTaXplID0gMC4yICogc2NhbGVGYWN0b3I7IFxyXG4gICAgICAgIGNvbnN0IGV5ZVBvc2l0aW9uWSA9IDAuMiAqIHNjYWxlRmFjdG9yO1xyXG4gICAgICAgIGNvbnN0IGV5ZU9mZnNldCA9IDAuMjUgKiBzY2FsZUZhY3RvcjtcclxuXHJcbiAgICAgICAgaWYgKGV5ZVNoYXBlID09PSAnY2lyY2xlJykge1xyXG4gICAgICAgICAgICBjb25zdCBleWVHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShleWVTaXplIC8gMiwgMTYsIDE2KTtcclxuICAgICAgICAgICAgY29uc3QgZXllTGVmdCA9IG5ldyBUSFJFRS5NZXNoKGV5ZUdlb21ldHJ5LCBleWVNYXRlcmlhbCk7XHJcbiAgICAgICAgICAgIGV5ZUxlZnQucG9zaXRpb24uc2V0KC1leWVPZmZzZXQsIGV5ZVBvc2l0aW9uWSwgMC43ICogc2NhbGVGYWN0b3IpO1xyXG4gICAgICAgICAgICBsYW50ZXJuR3JvdXAuYWRkKGV5ZUxlZnQpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZXllUmlnaHQgPSBuZXcgVEhSRUUuTWVzaChleWVHZW9tZXRyeSwgZXllTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBleWVSaWdodC5wb3NpdGlvbi5zZXQoZXllT2Zmc2V0LCBleWVQb3NpdGlvblksIDAuNyAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICAgICAgbGFudGVybkdyb3VwLmFkZChleWVSaWdodCk7XHJcbiAgICAgICAgfSBlbHNlIHsgLy8gJ3RyaWFuZ2xlJ1xyXG4gICAgICAgICAgICBjb25zdCBleWVHZW9tZXRyeSA9IG5ldyBUSFJFRS5Db25lR2VvbWV0cnkoZXllU2l6ZSAvIDIsIGV5ZVNpemUsIDMpO1xyXG4gICAgICAgICAgICBleWVHZW9tZXRyeS5yb3RhdGVYKC1NYXRoLlBJIC8gMik7XHJcbiAgICAgICAgICAgIGNvbnN0IGV5ZUxlZnQgPSBuZXcgVEhSRUUuTWVzaChleWVHZW9tZXRyeSwgZXllTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBleWVMZWZ0LnBvc2l0aW9uLnNldCgtZXllT2Zmc2V0LCBleWVQb3NpdGlvblksIDAuNyAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICAgICAgZXllTGVmdC5yb3RhdGlvbi56ID0gTWF0aC5yYW5kb20oKSAqIE1hdGguUEkgKiAyO1xyXG4gICAgICAgICAgICBsYW50ZXJuR3JvdXAuYWRkKGV5ZUxlZnQpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZXllUmlnaHQgPSBuZXcgVEhSRUUuTWVzaChleWVHZW9tZXRyeSwgZXllTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICBleWVSaWdodC5wb3NpdGlvbi5zZXQoZXllT2Zmc2V0LCBleWVQb3NpdGlvblksIDAuNyAqIHNjYWxlRmFjdG9yKTtcclxuICAgICAgICAgICAgZXllUmlnaHQucm90YXRpb24ueiA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcclxuICAgICAgICAgICAgbGFudGVybkdyb3VwLmFkZChleWVSaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjg6njg7Pjg4Djg6Djgarlj6Pjga7lvaLnirYgKOeskemhlOOAgeOBuOOBruWtlylcclxuICAgICAgICBjb25zdCBtb3V0aFR5cGUgPSBNYXRoLnJhbmRvbSgpID4gMC41ID8gJ3NtaWxlJyA6ICdmcm93bic7XHJcbiAgICAgICAgY29uc3QgbW91dGhQb3NpdGlvblkgPSAtMC4yICogc2NhbGVGYWN0b3I7XHJcbiAgICAgICAgY29uc3QgbW91dGhQb3NpdGlvblogPSAwLjcxICogc2NhbGVGYWN0b3I7XHJcbiAgICAgICAgY29uc3QgbW91dGhXaWR0aCA9IDAuMjUgKiBzY2FsZUZhY3RvcjtcclxuICAgICAgICBjb25zdCBtb3V0aEhlaWdodCA9IDAuMSAqIHNjYWxlRmFjdG9yO1xyXG4gICAgICAgIGNvbnN0IG1vdXRoRGVwdGggPSAwLjEgKiBzY2FsZUZhY3RvcjtcclxuICAgICAgICBjb25zdCBtb3V0aFNlZ21lbnRzID0gMyArIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpO1xyXG5cclxuICAgICAgICBpZiAobW91dGhUeXBlID09PSAnc21pbGUnKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW91dGhTZWdtZW50czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhbmdsZSA9IChpIC8gKG1vdXRoU2VnbWVudHMgLSAxKSAtIDAuNSkgKiBNYXRoLlBJIC8gMztcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSBNYXRoLnNpbihhbmdsZSkgKiBtb3V0aFdpZHRoICogMS41O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IE1hdGguY29zKGFuZ2xlKSAqIG1vdXRoSGVpZ2h0IC0gbW91dGhIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50ID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KG1vdXRoV2lkdGggLyAobW91dGhTZWdtZW50cyAtIDEpICogMC44LCBtb3V0aEhlaWdodCwgbW91dGhEZXB0aCksIG1vdXRoTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5wb3NpdGlvbi5zZXQoeCwgbW91dGhQb3NpdGlvblkgKyB5LCBtb3V0aFBvc2l0aW9uWik7XHJcbiAgICAgICAgICAgICAgICBzZWdtZW50LnJvdGF0aW9uLnogPSBhbmdsZTtcclxuICAgICAgICAgICAgICAgIGxhbnRlcm5Hcm91cC5hZGQoc2VnbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgeyAvLyAnZnJvd24nXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW91dGhTZWdtZW50czsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZWdtZW50ID0gbmV3IFRIUkVFLk1lc2gobmV3IFRIUkVFLkJveEdlb21ldHJ5KG1vdXRoV2lkdGggLyAobW91dGhTZWdtZW50cyAtIDEpICogMC44LCBtb3V0aEhlaWdodCwgbW91dGhEZXB0aCksIG1vdXRoTWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICAgICAgc2VnbWVudC5wb3NpdGlvbi5zZXQoKGkgLyAobW91dGhTZWdtZW50cyAtIDEpIC0gMC41KSAqIG1vdXRoV2lkdGgsIG1vdXRoUG9zaXRpb25ZLCBtb3V0aFBvc2l0aW9uWik7XHJcbiAgICAgICAgICAgICAgICBsYW50ZXJuR3JvdXAuYWRkKHNlZ21lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdGVtR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjEgKiBzY2FsZUZhY3RvciwgMC4xNSAqIHNjYWxlRmFjdG9yLCAwLjMgKiBzY2FsZUZhY3RvciwgOCk7XHJcbiAgICAgICAgY29uc3Qgc3RlbU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IDB4MjI4QjIyIH0pO1xyXG4gICAgICAgIGNvbnN0IHN0ZW0gPSBuZXcgVEhSRUUuTWVzaChzdGVtR2VvbWV0cnksIHN0ZW1NYXRlcmlhbCk7XHJcbiAgICAgICAgc3RlbS5wb3NpdGlvbi55ID0gMC44ICogc2NhbGVGYWN0b3I7XHJcbiAgICAgICAgc3RlbS5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICBsYW50ZXJuR3JvdXAuYWRkKHN0ZW0pO1xyXG5cclxuICAgICAgICBjb25zdCBsaWdodCA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KDB4RkZENzAwLCAwLjUsIDEwICogc2NhbGVGYWN0b3IpO1xyXG4gICAgICAgIGxpZ2h0LnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcclxuICAgICAgICBsYW50ZXJuR3JvdXAuYWRkKGxpZ2h0KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGxhbnRlcm5Hcm91cDtcclxuICAgIH1cclxuXHJcbiAgICAvLyDjgrjjg6Pjg4Pjgq/jg7vjgqrjg7zjg7vjg6njg7Pjgr/jg7Pjga7phY3nva7plqLmlbBcclxuICAgIHByaXZhdGUgcGxhY2VKYWNrT0xhbnRlcm5zID0gKG51bTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3IgPSAxLjAgLyAwLjc7XHJcbiAgICAgICAgY29uc3QgbGFudGVybkhhbGZIZWlnaHQgPSAwLjc3ICogc2NhbGVGYWN0b3I7XHJcblxyXG4gICAgICAgIC8vIOS4iuS4i+mBi+WLleOBruaMr+W5hVxyXG4gICAgICAgIGNvbnN0IGFtcGxpdHVkZSA9IDAuNTsgXHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbGFudGVybiA9IHRoaXMuY3JlYXRlSmFja09MYW50ZXJuKCk7XHJcbiAgICAgICAgICAgIGxhbnRlcm4ucG9zaXRpb24ueCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMuZmxvb3JTaXplICogMjtcclxuICAgICAgICAgICAgbGFudGVybi5wb3NpdGlvbi56ID0gKE1hdGgucmFuZG9tKCkgLSAwLjUpICogdGhpcy5mbG9vclNpemUgKiAyO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGFudGVybi5wb3NpdGlvbi55ID0gKC0xICsgbGFudGVybkhhbGZIZWlnaHQgKyBhbXBsaXR1ZGUpICsgMC45OyBcclxuXHJcbiAgICAgICAgICAgIGxhbnRlcm4ucm90YXRpb24ueSArPSBNYXRoLnJhbmRvbSgpICogTWF0aC5QSTsgLy8g44Op44Oz44OA44Og44Gq5ZCR44GN44Gr5Zue6LuiXHJcblxyXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChsYW50ZXJuKTtcclxuICAgICAgICAgICAgdGhpcy5qYWNrT0xhbnRlcm5zLnB1c2gobGFudGVybik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOS4jeawl+WRs+OBquaer+OCjOOBn+acqOOBruS9nOaIkFxyXG4gICAgcHJpdmF0ZSBjcmVhdGVTcG9va3lUcmVlID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHRyZWVHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIGNvbnN0IHRydW5rQ29sb3IgPSAweDAwMDAwMDsgLy8g6buSXHJcbiAgICAgICAgY29uc3QgYnJhbmNoQ29sb3IgPSAweDExMTExMTsgLy8g5p6d44Gv5bCR44GX44Gg44GR5piO44KL44GE6buSXHJcbiAgICAgICAgY29uc3QgdHJ1bmtNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7IGNvbG9yOiB0cnVua0NvbG9yIH0pO1xyXG4gICAgICAgIGNvbnN0IGJyYW5jaE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHsgY29sb3I6IGJyYW5jaENvbG9yIH0pO1xyXG5cclxuICAgICAgICAvLyDlhajkvZPjgpLlpKfjgY3jgY9cclxuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9IDEuNTtcclxuXHJcbiAgICAgICAgLy8g5bm5XHJcbiAgICAgICAgY29uc3QgdHJ1bmtHZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KDAuNCAqIHNjYWxlRmFjdG9yLCAwLjcgKiBzY2FsZUZhY3RvciwgNiAqIHNjYWxlRmFjdG9yLCA4KTsgLy8g5aSq44GV44Go6auY44GV44KS6Kq/5pW0XHJcbiAgICAgICAgY29uc3QgdHJ1bmsgPSBuZXcgVEhSRUUuTWVzaCh0cnVua0dlb21ldHJ5LCB0cnVua01hdGVyaWFsKTtcclxuICAgICAgICB0cnVuay5wb3NpdGlvbi55ID0gMiAqIHNjYWxlRmFjdG9yOyAvLyDlnLDpnaLjgYvjgonnlJ/jgYjjgovjgojjgYbjgatcclxuICAgICAgICB0cnVuay5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICB0cmVlR3JvdXAuYWRkKHRydW5rKTtcclxuXHJcbiAgICAgICAgLy8g5p6d44Gu5L2c5oiQ6Zai5pWwXHJcbiAgICAgICAgY29uc3QgY3JlYXRlQnJhbmNoID0gKHBhcmVudDogVEhSRUUuT2JqZWN0M0QsIHJhZGl1c1RvcDogbnVtYmVyLCByYWRpdXNCb3R0b206IG51bWJlciwgaGVpZ2h0OiBudW1iZXIsIHBvc1g6IG51bWJlciwgcG9zWTogbnVtYmVyLCBwb3NaOiBudW1iZXIsIHJvdFo6IG51bWJlciwgcm90WTogbnVtYmVyID0gMCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DeWxpbmRlckdlb21ldHJ5KHJhZGl1c1RvcCwgcmFkaXVzQm90dG9tLCBoZWlnaHQsIDYpOyAvLyDntLDjgYTlhobmn7FcclxuICAgICAgICAgICAgY29uc3QgYnJhbmNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIGJyYW5jaE1hdGVyaWFsKTtcclxuICAgICAgICAgICAgYnJhbmNoLnBvc2l0aW9uLnNldChwb3NYLCBwb3NZLCBwb3NaKTtcclxuICAgICAgICAgICAgYnJhbmNoLnJvdGF0aW9uLnogPSByb3RaO1xyXG4gICAgICAgICAgICBicmFuY2gucm90YXRpb24ueSA9IHJvdFk7XHJcbiAgICAgICAgICAgIGJyYW5jaC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgcGFyZW50LmFkZChicmFuY2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gYnJhbmNoO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIOaenTFcclxuICAgICAgICBjb25zdCBtYWluQnJhbmNoMSA9IGNyZWF0ZUJyYW5jaCh0cnVuaywgMC4yICogc2NhbGVGYWN0b3IsIDAuMyAqIHNjYWxlRmFjdG9yLCAzICogc2NhbGVGYWN0b3IsIDAuNSAqIHNjYWxlRmFjdG9yLCAyLjUgKiBzY2FsZUZhY3RvciwgMCwgTWF0aC5QSSAvIDQsIDApO1xyXG5cclxuICAgICAgICAvLyDmnp0yXHJcbiAgICAgICAgY29uc3QgbWFpbkJyYW5jaDIgPSBjcmVhdGVCcmFuY2godHJ1bmssIDAuMiAqIHNjYWxlRmFjdG9yLCAwLjMgKiBzY2FsZUZhY3RvciwgMi41ICogc2NhbGVGYWN0b3IsIC0wLjYgKiBzY2FsZUZhY3RvciwgMi44ICogc2NhbGVGYWN0b3IsIDAsIC1NYXRoLlBJIC8gNSwgMCk7XHJcblxyXG4gICAgICAgIC8vIOaenTNcclxuICAgICAgICBjb25zdCBtYWluQnJhbmNoMyA9IGNyZWF0ZUJyYW5jaCh0cnVuaywgMC4xNSAqIHNjYWxlRmFjdG9yLCAwLjI1ICogc2NhbGVGYWN0b3IsIDIuOCAqIHNjYWxlRmFjdG9yLCAwLCAyLjIgKiBzY2FsZUZhY3RvciwgLTAuNiAqIHNjYWxlRmFjdG9yLCAtTWF0aC5QSSAvIDYsIE1hdGguUEkgLyAyKTtcclxuXHJcbiAgICAgICAgLy8g57Sw44GE5p6dXHJcbiAgICAgICAgY29uc3QgdGhpbkJyYW5jaDEgPSBjcmVhdGVCcmFuY2gobWFpbkJyYW5jaDEsIDAuMSAqIHNjYWxlRmFjdG9yLCAwLjE1ICogc2NhbGVGYWN0b3IsIDIgKiBzY2FsZUZhY3RvciwgMC44ICogc2NhbGVGYWN0b3IsIDEuNSAqIHNjYWxlRmFjdG9yLCAwLCAtTWF0aC5QSSAvIDMsIDApO1xyXG4gICAgICAgIGNvbnN0IHRoaW5CcmFuY2gyID0gY3JlYXRlQnJhbmNoKG1haW5CcmFuY2gxLCAwLjA4ICogc2NhbGVGYWN0b3IsIDAuMTIgKiBzY2FsZUZhY3RvciwgMS41ICogc2NhbGVGYWN0b3IsIDAuNiAqIHNjYWxlRmFjdG9yLCAxLjAgKiBzY2FsZUZhY3RvciwgMCwgTWF0aC5QSSAvIDUsIE1hdGguUEkgLyA0KTtcclxuXHJcbiAgICAgICAgY29uc3QgdGhpbkJyYW5jaDMgPSBjcmVhdGVCcmFuY2gobWFpbkJyYW5jaDIsIDAuMSAqIHNjYWxlRmFjdG9yLCAwLjE1ICogc2NhbGVGYWN0b3IsIDEuOCAqIHNjYWxlRmFjdG9yLCAtMC43ICogc2NhbGVGYWN0b3IsIDEuMiAqIHNjYWxlRmFjdG9yLCAwLCBNYXRoLlBJIC8gMywgMCk7XHJcbiAgICAgICAgY29uc3QgdGhpbkJyYW5jaDQgPSBjcmVhdGVCcmFuY2gobWFpbkJyYW5jaDIsIDAuMDggKiBzY2FsZUZhY3RvciwgMC4xMiAqIHNjYWxlRmFjdG9yLCAxLjMgKiBzY2FsZUZhY3RvciwgLTAuNSAqIHNjYWxlRmFjdG9yLCAwLjggKiBzY2FsZUZhY3RvciwgMCwgLU1hdGguUEkgLyA2LCAtTWF0aC5QSSAvIDQpO1xyXG5cclxuICAgICAgICBjb25zdCB0aGluQnJhbmNoNSA9IGNyZWF0ZUJyYW5jaChtYWluQnJhbmNoMywgMC4wOCAqIHNjYWxlRmFjdG9yLCAwLjEyICogc2NhbGVGYWN0b3IsIDEuNSAqIHNjYWxlRmFjdG9yLCAwLjUgKiBzY2FsZUZhY3RvciwgMS4wICogc2NhbGVGYWN0b3IsIDAsIE1hdGguUEkgLyA0LCAwKTtcclxuXHJcblxyXG4gICAgICAgIHRyZWVHcm91cC5wb3NpdGlvbi55ID0gLTE7XHJcblxyXG4gICAgICAgIHJldHVybiB0cmVlR3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g5LiN5rCX5ZGz44Gq5p6v44KM44Gf5pyo44Gu6YWN572u6Zai5pWwXHJcbiAgICBwcml2YXRlIHBsYWNlU3Bvb2t5VHJlZXMgPSAobnVtOiBudW1iZXIpID0+IHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyZWUgPSB0aGlzLmNyZWF0ZVNwb29reVRyZWUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOODqeODs+ODgOODoOOBquS9jee9rlxyXG4gICAgICAgICAgICB0cmVlLnBvc2l0aW9uLnggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiB0aGlzLmZsb29yU2l6ZSAqIDI7XHJcbiAgICAgICAgICAgIHRyZWUucG9zaXRpb24ueiA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIHRoaXMuZmxvb3JTaXplICogMjtcclxuICAgICAgICAgICAgdHJlZS5wb3NpdGlvbi55ID0gLTE7IC8vIOWcsOmdouOBruWfuua6luOBq+WQiOOCj+OBm+OCi1xyXG5cclxuICAgICAgICAgICAgLy8g44Op44Oz44OA44Og44Gq5Zue6LuiICjmnq/jgozmnKjjga7lkJHjgY0pXHJcbiAgICAgICAgICAgIHRyZWUucm90YXRpb24ueSA9IE1hdGgucmFuZG9tKCkgKiBNYXRoLlBJICogMjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKHRyZWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBCZXppZXLmm7Lnt5rplqLmlbBcclxuICAgIHByaXZhdGUgYmV6aWVyID0gKHAwOiBUSFJFRS5WZWN0b3IzLCBwMTogVEhSRUUuVmVjdG9yMyxcclxuICAgICAgICBwMjogVEhSRUUuVmVjdG9yMywgcDM6IFRIUkVFLlZlY3RvcjMsIHQ6IG51bWJlcik6IChUSFJFRS5WZWN0b3IzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbXQgPSAxLjAgLSB0O1xyXG4gICAgICAgIGNvbnN0IG10MiA9IG10ICogbXQ7XHJcbiAgICAgICAgY29uc3QgbXQzID0gbXQyICogbXQ7XHJcbiAgICAgICAgY29uc3QgdDIgPSB0ICogdDtcclxuICAgICAgICBjb25zdCB0MyA9IHQyICogdDtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgICAgICByZXN1bHQueCA9IG10MyAqIHAwLnggKyAzICogbXQyICogdCAqIHAxLnggKyAzICogbXQgKiB0MiAqIHAyLnggKyB0MyAqIHAzLng7XHJcbiAgICAgICAgcmVzdWx0LnkgPSBtdDMgKiBwMC55ICsgMyAqIG10MiAqIHQgKiBwMS55ICsgMyAqIG10ICogdDIgKiBwMi55ICsgdDMgKiBwMy55O1xyXG4gICAgICAgIHJlc3VsdC56ID0gbXQzICogcDAueiArIDMgKiBtdDIgKiB0ICogcDEueiArIDMgKiBtdCAqIHQyICogcDIueiArIHQzICogcDMuejtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmmrOOBruOCouODi+ODoeODvOOCt+ODp+ODs+ODreOCuOODg+OCrzpCZXppZXLmm7Lnt5pcclxuICAgIHByaXZhdGUgYW5pbWF0ZUhvcnNlID0gKCkgPT4ge1xyXG4gICAgICAgIGlmICghdGhpcy5ob3JzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMuY2xvY2suZ2V0RGVsdGEoKTtcclxuICAgICAgICB0aGlzLnQgKz0gZGVsdGEgLyB0aGlzLnBhdGhEdXJhdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudCA+PSAxLjApIHtcclxuICAgICAgICAgICAgdGhpcy50IC09IDEuMDtcclxuICAgICAgICAgICAgdGhpcy5zZWcgPSAodGhpcy5zZWcgKyAxKSAlICh0aGlzLnBvaW50cy5sZW5ndGggLyA0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCu+OCsOODoeODs+ODiOOBruWItuW+oeeCueOCkuWPluW+l1xyXG4gICAgICAgIGNvbnN0IHAwID0gdGhpcy5wb2ludHNbdGhpcy5zZWcgKiA0ICsgMF07XHJcbiAgICAgICAgY29uc3QgcDEgPSB0aGlzLnBvaW50c1t0aGlzLnNlZyAqIDQgKyAxXTtcclxuICAgICAgICBjb25zdCBwMiA9IHRoaXMucG9pbnRzW3RoaXMuc2VnICogNCArIDJdO1xyXG4gICAgICAgIGNvbnN0IHAzID0gdGhpcy5wb2ludHNbdGhpcy5zZWcgKiA0ICsgM107XHJcblxyXG4gICAgICAgIC8vIEJlemllcuabsue3muS4iuOBruS9jee9ruOCkuioiOeul1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRQb3MgPSB0aGlzLmJlemllcihwMCwgcDEsIHAyLCBwMywgdGhpcy50KTtcclxuXHJcbiAgICAgICAgbGV0IGxvb2tBdFQgPSBNYXRoLm1pbih0aGlzLnQgKyAwLjAwMSwgMS4wKTtcclxuICAgICAgICBsZXQgbG9va0F0TmV4dFNlZyA9IHRoaXMuc2VnO1xyXG4gICAgICAgIGlmIChsb29rQXRUID49IDEuMCkge1xyXG4gICAgICAgICAgICBsb29rQXRUID0gMC4wMDE7XHJcbiAgICAgICAgICAgIGxvb2tBdE5leHRTZWcgPSAodGhpcy5zZWcgKyAxKSAlICh0aGlzLnBvaW50cy5sZW5ndGggLyA0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5leHRQMCA9IHRoaXMucG9pbnRzW2xvb2tBdE5leHRTZWcgKiA0ICsgMF07XHJcbiAgICAgICAgY29uc3QgbmV4dFAxID0gdGhpcy5wb2ludHNbbG9va0F0TmV4dFNlZyAqIDQgKyAxXTtcclxuICAgICAgICBjb25zdCBuZXh0UDIgPSB0aGlzLnBvaW50c1tsb29rQXROZXh0U2VnICogNCArIDJdO1xyXG4gICAgICAgIGNvbnN0IG5leHRQMyA9IHRoaXMucG9pbnRzW2xvb2tBdE5leHRTZWcgKiA0ICsgM107XHJcblxyXG4gICAgICAgIGNvbnN0IHRhcmdldFBvcyA9IHRoaXMuYmV6aWVyKG5leHRQMCwgbmV4dFAxLCBuZXh0UDIsIG5leHRQMywgbG9va0F0VCk7XHJcblxyXG4gICAgICAgIC8vIOmmrOOBrlnluqfmqJnjga/lnLDpnaLjgavlm7rlrppcclxuICAgICAgICB0aGlzLmhvcnNlLnBvc2l0aW9uLnggPSBjdXJyZW50UG9zLng7XHJcbiAgICAgICAgdGhpcy5ob3JzZS5wb3NpdGlvbi56ID0gY3VycmVudFBvcy56O1xyXG5cclxuICAgICAgICAvLyDppqzjga7poK3jgYzpgLLooYzmlrnlkJHjgpLlkJHjgY/jgojjgYbjgatsb29rQXTjgpLkvb/nlKhcclxuICAgICAgICB0aGlzLmhvcnNlLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMyh0YXJnZXRQb3MueCwgdGhpcy5ob3JzZS5wb3NpdGlvbi55LCB0YXJnZXRQb3MueikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOOCuOODo+ODg+OCr+ODu+OCquODvOODu+ODqeODs+OCv+ODs+OBruOCouODi+ODoeODvOOCt+ODp+ODs+ODreOCuOODg+OCr1xyXG4gICAgcHJpdmF0ZSBhbmltYXRlSmFja09MYW50ZXJucyA9ICh0aW1lOiBET01IaWdoUmVzVGltZVN0YW1wKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYW1wbGl0dWRlID0gMC41OyAvLyDkuIrkuIvpgYvli5Xjga7mjK/luYVcclxuICAgICAgICBjb25zdCBmcmVxdWVuY3kgPSAwLjAwMjsgLy8g5LiK5LiL6YGL5YuV44Gu6YCf44GVXHJcblxyXG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gMS4wIC8gMC43O1xyXG4gICAgICAgIGNvbnN0IGxhbnRlcm5IYWxmSGVpZ2h0ID0gMC43NyAqIHNjYWxlRmFjdG9yO1xyXG5cclxuICAgICAgICB0aGlzLmphY2tPTGFudGVybnMuZm9yRWFjaCgobGFudGVybiwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgbGFudGVybi5wb3NpdGlvbi55ID0gKC0xICsgbGFudGVybkhhbGZIZWlnaHQgKyBhbXBsaXR1ZGUpICsgMC45ICsgTWF0aC5zaW4odGltZSAqIGZyZXF1ZW5jeSArIGluZGV4ICogMC41KSAqIGFtcGxpdHVkZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xyXG5cclxuZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIGxldCBjb250YWluZXIgPSBuZXcgVGhyZWVKU0NvbnRhaW5lcigpO1xyXG4gICAgbGV0IHZpZXdwb3J0ID0gY29udGFpbmVyLmNyZWF0ZVJlbmRlcmVyRE9NKHdpbmRvdy5pbm5lcldpZHRoICogMC45LCB3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjksIG5ldyBUSFJFRS5WZWN0b3IzKDAsIDIwLCAzMCkpOyAvLyDjgqvjg6Hjg6njgpLlsJHjgZfpq5jjgY/jgIHlvozjgo3jgavlvJXjgY9cclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCJ2YXIgZGVmZXJyZWQgPSBbXTtcbl9fd2VicGFja19yZXF1aXJlX18uTyA9IChyZXN1bHQsIGNodW5rSWRzLCBmbiwgcHJpb3JpdHkpID0+IHtcblx0aWYoY2h1bmtJZHMpIHtcblx0XHRwcmlvcml0eSA9IHByaW9yaXR5IHx8IDA7XG5cdFx0Zm9yKHZhciBpID0gZGVmZXJyZWQubGVuZ3RoOyBpID4gMCAmJiBkZWZlcnJlZFtpIC0gMV1bMl0gPiBwcmlvcml0eTsgaS0tKSBkZWZlcnJlZFtpXSA9IGRlZmVycmVkW2kgLSAxXTtcblx0XHRkZWZlcnJlZFtpXSA9IFtjaHVua0lkcywgZm4sIHByaW9yaXR5XTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIG5vdEZ1bGZpbGxlZCA9IEluZmluaXR5O1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IGRlZmVycmVkLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIFtjaHVua0lkcywgZm4sIHByaW9yaXR5XSA9IGRlZmVycmVkW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvciAodmFyIGogPSAwOyBqIDwgY2h1bmtJZHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdGlmICgocHJpb3JpdHkgJiAxID09PSAwIHx8IG5vdEZ1bGZpbGxlZCA+PSBwcmlvcml0eSkgJiYgT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5PKS5ldmVyeSgoa2V5KSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXy5PW2tleV0oY2h1bmtJZHNbal0pKSkpIHtcblx0XHRcdFx0Y2h1bmtJZHMuc3BsaWNlKGotLSwgMSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHRcdFx0aWYocHJpb3JpdHkgPCBub3RGdWxmaWxsZWQpIG5vdEZ1bGZpbGxlZCA9IHByaW9yaXR5O1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihmdWxmaWxsZWQpIHtcblx0XHRcdGRlZmVycmVkLnNwbGljZShpLS0sIDEpXG5cdFx0XHR2YXIgciA9IGZuKCk7XG5cdFx0XHRpZiAociAhPT0gdW5kZWZpbmVkKSByZXN1bHQgPSByO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiaXRDb250cm9sc19qc1wiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==