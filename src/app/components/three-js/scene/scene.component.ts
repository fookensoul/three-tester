import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ThreeScene } from '../../../services/three-js/three-scene';
import { ThreeModelFactory } from '../../../services/three-js/three-model-factory';
import { CameraOptions } from '../../../models/three-js/camera-options';
import { RendererOptions } from '../../../models/three-js/renderer-options';
import { ColorCube, TOP, BOTTOM, LEFT, RIGHT, BACK, FRONT } from '../../../models/three-js/color-cube';
import * as THREE from 'three';
import * as _ from 'lodash';

@Component({
  selector: 'scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {
  @ViewChild('container') containerRef: ElementRef;
  container: HTMLElement;
  cameraOptions: CameraOptions;
  rendererOptions: RendererOptions;

  cameraOptionsSubscription: Subscription;
  rendererOptionsSubscription: Subscription;

  cubeSize: number = 10;
  cube: THREE.Mesh[];
  cubeGroupAll: THREE.Object3D;
  cubeHistory: THREE.Object3D[];

  textureLoader: THREE.TextureLoader;
  blackPhongMaterial: THREE.MeshPhongMaterial;
  whitePhongMaterial: THREE.MeshPhongMaterial;
  yellowPhongMaterial: THREE.MeshPhongMaterial;
  redPhongMaterial: THREE.MeshPhongMaterial;
  orangePhongMaterial: THREE.MeshPhongMaterial;
  bluePhongMaterial: THREE.MeshPhongMaterial;
  greenPhongMaterial: THREE.MeshPhongMaterial;
  defaultMaterials: THREE.MeshPhongMaterial[];

  previousMouseX: number = 0;
  previousMouseY: number = 0;

  constructor(private threeScene: ThreeScene) {
    this.textureLoader = new THREE.TextureLoader()
    this.blackPhongMaterial = new THREE.MeshPhongMaterial({ map: this.textureLoader.load('../../../../assets/images/cube_black_100x100_5pxIn.png') });
    this.whitePhongMaterial = new THREE.MeshPhongMaterial({ map: this.textureLoader.load('../../../../assets/images/cube_white_100x100_5pxIn.png') });
    this.yellowPhongMaterial = new THREE.MeshPhongMaterial({ map: this.textureLoader.load('../../../../assets/images/cube_yellow_100x100_5pxIn.png') });
    this.redPhongMaterial = new THREE.MeshPhongMaterial({ map: this.textureLoader.load('../../../../assets/images/cube_red_100x100_5pxIn.png') });
    this.orangePhongMaterial = new THREE.MeshPhongMaterial({ map: this.textureLoader.load('../../../../assets/images/cube_orange_100x100_5pxIn.png') });
    this.bluePhongMaterial = new THREE.MeshPhongMaterial({ map: this.textureLoader.load('../../../../assets/images/cube_blue_100x100_5pxIn.png') });
    this.greenPhongMaterial = new THREE.MeshPhongMaterial({ map: this.textureLoader.load('../../../../assets/images/cube_green_100x100_5pxIn.png') });



    this.cubeHistory = new Array<THREE.Object3D>();
  }

  ngOnInit() {
    this.cameraOptions = new CameraOptions(70,
      800 / 600,
      0.1,
      500,
      { x: -20, y: 25, z: 100 },
      new THREE.Vector3(0, 0, 0)
    );
    this.rendererOptions = new RendererOptions(0xffffff, { width: 800, height: 600 });

    this.container = this.containerRef.nativeElement;
    this.container.appendChild(this.threeScene.getRenderer().domElement);
    this.initGeometry();
    this.initListeners();

    this.threeScene.setCameraOptions(this.cameraOptions);
    this.threeScene.setRendererOptions(this.rendererOptions);
  }

  initGeometry() {
    const geometry = new THREE.BoxGeometry(this.cubeSize, this.cubeSize, this.cubeSize);
    this.cubeGroupAll = new THREE.Object3D();

    for (var x = -this.cubeSize; x <= -this.cubeSize; x += this.cubeSize) {
      for (var y = 0; y <= this.cubeSize; y += this.cubeSize) {
        for (var z = this.cubeSize; z <= this.cubeSize; z += this.cubeSize) {
          this.defaultMaterials = [this.blackPhongMaterial, this.blackPhongMaterial, this.blackPhongMaterial, this.blackPhongMaterial, this.blackPhongMaterial, this.blackPhongMaterial];

          const rCube = new ColorCube(geometry, this.defaultMaterials);
          this.cubeGroupAll.add(rCube);
          rCube.position.set(x, y, z);

          if (x == -this.cubeSize) {
            rCube.setSideMaterial(LEFT, this.redPhongMaterial);
            rCube.name += 'Red';
          } 
          else if (x == this.cubeSize) {
            rCube.material[RIGHT] = this.orangePhongMaterial;
            rCube.name += 'Orange';
          } else {
          }

          if (y == -this.cubeSize) {
            rCube.setSideMaterial(BOTTOM, this.yellowPhongMaterial);
            rCube.name += 'Yellow';
          } else if (y == this.cubeSize) {
            rCube.setSideMaterial(TOP, this.whitePhongMaterial);
            rCube.name += 'White';
          } else {
          }

          if (z == -this.cubeSize) {
            rCube.setSideMaterial(BACK, this.bluePhongMaterial);
            rCube.name += 'Blue';
          } else if (z == this.cubeSize) {
            rCube.setSideMaterial(FRONT, this.greenPhongMaterial);
            rCube.name += 'Green';
          } else {

          }
        }
      }
    }
    this.threeScene.addToScene(this.cubeGroupAll);
    this.threeScene.render(() => {
      this.renderFunc();
    });
  }

  renderFunc() {
    //this.threeScene.rotateOnWorldAxisX(this.cubeGroupAll, 1);
  }


  initListeners() {
    // window.addEventListener('resize', (e) => {
    //   this.cameraOptions.aspect = window.innerWidth / window.innerHeight;
    //   this.rendererOptions.size = { width: window.innerWidth, height: window.innerHeight };
    //   this.threeScene.setCameraOptions(this.cameraOptions);
    //   this.threeScene.setRendererOptions(this.rendererOptions);
    // });

    window.addEventListener('mousedown', (e) => {
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.previousMouseX + this.previousMouseY > 0) {
        if (e.clientX > this.previousMouseX) {
          this.cubeGroupAll.rotateY(0.05);
        } else if (e.clientX < this.previousMouseX) {
          this.cubeGroupAll.rotateY(-0.05);
        }
        if (e.clientY > this.previousMouseY) {
          this.cubeGroupAll.rotateX(0.05);
        } else if (e.clientY < this.previousMouseY) {
          this.cubeGroupAll.rotateX(-0.05);
        }
        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;
      }
    });

    window.addEventListener('mouseup', (e) => {
      this.previousMouseX = this.previousMouseY = 0;
    });

    window.addEventListener('keypress', (e) => {

      if (e.key == 's')
        this.threeScene.rotateOnWorldAxisX(this.cubeGroupAll, 90, 1.5, true);

      if (e.key == 'w')
        this.threeScene.rotateOnWorldAxisX(this.cubeGroupAll, -90, 1.5, true);

      if (e.key == 'a')
        this.threeScene.rotateOnWorldAxisY(this.cubeGroupAll, -90, 1.5, true);

      if (e.key == 'd')
        this.threeScene.rotateOnWorldAxisY(this.cubeGroupAll, 90, 1.5, true);

      if (e.key == 'z')
        this.threeScene.rotateToDefault(this.cubeGroupAll, 0.25);

      if (e.key == 'f') {
        this.rotateColorCubes(-10.00, 0, 0, 90);
      }

      if (e.key == 'g') {
        this.rotateColor('White');
      }

      if (e.key == 'h') {
        this.rotateColor('Green');
      }
    });
  }
  rotateColor(color: string) {
    let currentRot = this.cubeGroupAll.rotation.toVector3();
    this.cubeGroupAll.rotation.set(0, 0, 0);
    this.cubeGroupAll.updateMatrixWorld(true);

    let colorCube = this.cubeGroupAll.getObjectByName(color);
    let colorPos = this.threeScene.getWorldCoords(colorCube).round();

    let group = new THREE.Object3D();
    group.name = 'slice';
    this.cubeGroupAll.children.forEach(c => {
      let childPos = this.threeScene.getWorldCoords(c).round();
      if (colorPos.x != 0 && childPos.x == colorPos.x) {
        //c.position.set(c.position.x, c.position.y + 60, c.position.z);
        let rotation = THREE.Math.degToRad(45);
        this.setWorldRotationX(c, rotation);
      }
      else if (colorPos.y != 0 && childPos.y == colorPos.y) {
        //c.position.set(c.position.x, c.position.y + 60, c.position.z);

        let rotation = THREE.Math.degToRad(45);
        console.log(childPos)
        this.setWorldRotationY(c, rotation);
      } else {

      }

    });
  }

  rotateColorCubes(xTarget: number,
    yTarget: number,
    zTarget: number,
    radians: number) {

    xTarget = xTarget == 0 ? undefined : xTarget;
    yTarget = yTarget == 0 ? undefined : yTarget;
    zTarget = zTarget == 0 ? undefined : zTarget;

    let currentRot = this.cubeGroupAll.rotation.toVector3();
    this.cubeGroupAll.rotation.set(0, 0, 0);
    this.cubeGroupAll.updateMatrixWorld(true);

    let cubes: ColorCube[] = new Array<ColorCube>();
    let group: THREE.Object3D = new THREE.Object3D();

    for (let i = this.cubeGroupAll.children.length - 1; i >= 0; i--) {
      let cClone: ColorCube = this.cubeGroupAll.children[i].clone(true) as ColorCube;
      let colorPos = this.threeScene.getWorldCoords(cClone).round();
      if (colorPos.x == xTarget || colorPos.y == yTarget || colorPos.z == zTarget) {
        group.add(cClone);
        this.cubeGroupAll.remove(this.cubeGroupAll.children[i]);
      }
    }
    this.cubeGroupAll.add(group);
    this.cubeGroupAll.rotation.setFromVector3(currentRot);
    this.threeScene.rotateOnWorldAxisX(group, radians, 3, true, () => {

      let currentRot = this.cubeGroupAll.rotation.toVector3();
      this.cubeGroupAll.rotation.set(0, 0, 0);
      
      for (let i = group.children.length - 1; i >= 0; i--) {
        let cClone = group.children[i].clone(true) as ColorCube;
        group.remove(group.children[i]);
        let colorPos = this.threeScene.getWorldCoords(cClone).round();
        let newCube: ColorCube = new ColorCube(
          new THREE.CubeGeometry(this.cubeSize, this.cubeSize, this.cubeSize),
          this.defaultMaterials);
        
        newCube.rotateMesh(cClone as ColorCube, this.cubeSize, xTarget, yTarget, zTarget, radians);
        newCube.position.set(colorPos.x, colorPos.y, colorPos.z);
        
        this.cubeGroupAll.add(newCube);
      }
      this.cubeGroupAll.remove(group);
    });
  }


  setWorldRotationX(object: THREE.Object3D, radians: number) {
    let cObject = object.clone(true);
    let m = object.matrix.toArray();
    let rotationMatrix = [
      1.0, 0.0, 0.0, 0.0,
      0.0, Math.cos(radians), -Math.sin(radians), 0.0,
      0.0, Math.sin(radians), Math.cos(radians), 0.0,
      0.0, 0.0, 0.0, 0.0
    ];
    let rotationMatrix4 = new THREE.Matrix4().fromArray(rotationMatrix);
    let rot = cObject.matrix.premultiply(rotationMatrix4);
    cObject.applyMatrix(rot);
    let wPos = this.threeScene.getWorldCoords(cObject).round();
    object.position.set(wPos.x, wPos.y, wPos.z);
    this.threeScene.rotateOnWorldAxisX(object, 270, 5, true);
    //object.rotateX(1.57);
    //object.updateMatrixWorld(true);
    //console.log(object.position);
  }

  setWorldRotationY(object: THREE.Object3D, radians: number) {
    let cObject = object.clone(true);
    let m = object.matrix.toArray();
    let rotationMatrix = [
      Math.cos(radians), 0.0, Math.sin(radians), 0.0,
      0.0, 1.0, 0.0, 0.0,
      -Math.sin(radians), 0.0, Math.cos(radians), 0.0,
      0.0, 0.0, 0.0, 0.0
    ];
    let rotationMatrix4 = new THREE.Matrix4().fromArray(rotationMatrix);
    let rot = cObject.matrix.premultiply(rotationMatrix4);
    cObject.applyMatrix(rot);
    let wPos = this.threeScene.getWorldCoords(cObject).round();

    object.rotateY(3.14);
    object.position.set(wPos.x, wPos.y, wPos.z);
  }

  setWorldRotationZ(object: THREE.Object3D, radians: number) {
    let m = object.matrix.toArray();
    let rotationMatrix = [
      1.0, 0.0, 0.0, 0.0,
      0.0, Math.cos(radians), -Math.sin(radians), 0.0,
      0.0, Math.sin(radians), Math.cos(radians), 0.0,
      0.0, 0.0, 0.0, 0.0
    ];
    let rotationMatrix4 = new THREE.Matrix4().fromArray(rotationMatrix);
    let rot = object.matrix.premultiply(rotationMatrix4);
    object.applyMatrix(rot);
  }

  trotateColor(color: string) {
    let currentRot = this.cubeGroupAll.rotation.toVector3();
    this.cubeGroupAll.rotation.set(0, 0, 0);
    this.cubeGroupAll.updateMatrixWorld(true);
    let cubeGroupClone = this.cubeGroupAll.clone(true);

    this.threeScene.removeFromScene(this.cubeGroupAll);
    let colorCube = cubeGroupClone.getObjectByName(color);
    let colorPos = this.threeScene.getWorldCoords(colorCube).round();

    let group = new THREE.Object3D();
    group.name = 'slice';

    cubeGroupClone.children.forEach(c => {
      if (c.name == 'slice') {
        c.children.forEach(s => {
          let childPos = this.threeScene.getWorldCoords(s).round();
          let cClone = s.clone(true);
          if (colorPos.x != 0 && childPos.x == colorPos.x) {
            group.add(cClone);
          } else if (colorPos.y != 0 && childPos.y == colorPos.y) {
            group.add(cClone);
          } else if (colorPos.z != 0 && childPos.z == colorPos.z) {
            group.add(cClone);
          } else {
            this.cubeGroupAll.add(cClone);
          }
        });
      } else {
        let childPos = this.threeScene.getWorldCoords(c).round();
        let cClone = c.clone(true);
        if (colorPos.x != 0 && childPos.x == colorPos.x) {
          group.add(cClone);
        } else if (colorPos.y != 0 && childPos.y == colorPos.y) {
          group.add(cClone);
        } else if (colorPos.z != 0 && childPos.z == colorPos.z) {
          group.add(cClone);
        } else {
          this.cubeGroupAll.add(cClone);
        }
      }
    });
    this.cubeGroupAll.add(group);
    this.threeScene.addToScene(this.cubeGroupAll);

    let rotationAxis = new THREE.Vector3(colorPos.x != 0 ? 1 : 0, colorPos.y != 0 ? 1 : 0, colorPos.z != 0 ? 1 : 0);
    group.position.set(90, 0, 0);
    group.rotateOnAxis(rotationAxis, 1.57);
    group.updateMatrixWorld(true);

    //this.threeScene.rotateOnWorldAxisX(colorCube, 90, 5, true);
    this.cubeGroupAll.rotation.setFromVector3(currentRot);
  }
}
