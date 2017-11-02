import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ThreeScene } from '../../../services/three-js/three-scene';
import { ThreeModelFactory } from '../../../services/three-js/three-model-factory';
import { CameraOptions } from '../../../models/three-js/camera-options';
import { RendererOptions } from '../../../models/three-js/renderer-options';
import ColorCube from '../../../models/three-js/color-cube';
import ColorCubeComponent from '../../../models/three-js/color-cube-component';
import * as Constants from '../../../models/three-js/color-cube-constants';
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
  colorCube: ColorCube;
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

    this.colorCube = new ColorCube(this.cubeSize);
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
    this.rendererOptions = new RendererOptions(0xcccccc, { width: 800, height: 600 });

    this.container = this.containerRef.nativeElement;
    this.container.appendChild(this.threeScene.getRenderer().domElement);
    this.initGeometry();
    this.initListeners();

    this.threeScene.setCameraOptions(this.cameraOptions);
    this.threeScene.setRendererOptions(this.rendererOptions);
  }

  initGeometry() {
    this.setSceneGeometryFromColorCube(this.colorCube);
    this.threeScene.addToScene(this.cubeGroupAll);
    this.threeScene.render(() => {
      this.renderFunc();
    });
  }

  setSceneGeometryFromColorCube(colorCube: ColorCube) {
    let currentRotation = new THREE.Vector3(0, 0, 0);
    if (this.cubeGroupAll) {
      currentRotation = this.cubeGroupAll.rotation.toVector3();
      this.threeScene.removeFromScene(this.cubeGroupAll);
    }
    this.cubeGroupAll = new THREE.Object3D();
    let cubeComponents = colorCube.getCubeComponents();
    cubeComponents.forEach(c => {
      let materials = [this.blackPhongMaterial, this.blackPhongMaterial, this.blackPhongMaterial, this.blackPhongMaterial, this.blackPhongMaterial, this.blackPhongMaterial];
      const cube = new THREE.BoxGeometry(colorCube.componentSize, colorCube.componentSize, colorCube.componentSize);
      materials[Constants.TOP] = this.getMaterial(c.faceColors.top);
      materials[Constants.BOTTOM] = this.getMaterial(c.faceColors.bottom);
      materials[Constants.LEFT] = this.getMaterial(c.faceColors.left);
      materials[Constants.RIGHT] = this.getMaterial(c.faceColors.right);
      materials[Constants.FRONT] = this.getMaterial(c.faceColors.front);
      materials[Constants.BACK] = this.getMaterial(c.faceColors.back);
      const mesh = new THREE.Mesh(cube, materials);
      mesh.position.set(c.getPosition().x, c.getPosition().y, c.getPosition().z);
      this.cubeGroupAll.add(mesh);
    });

    this.threeScene.addToScene(this.cubeGroupAll);
    this.cubeGroupAll.rotation.setFromVector3(currentRotation);
  }

  renderFunc() {
    //this.threeScene.rotateOnWorldAxisX(this.cubeGroupAll, 1);
  }

  rotateSlice(slice: string, positiveRadians: boolean) {
    let currentRotation = this.cubeGroupAll.rotation.toVector3();
    let sliceGroup = new THREE.Object3D();
    this.cubeGroupAll.rotation.set(0, 0, 0);
    let positiveTarget = this.cubeSize;
    let negativeTarget = -this.cubeSize;

    for (let i = this.cubeGroupAll.children.length - 1; i >= 0; i--) {
      let cClone = this.cubeGroupAll.children[i].clone(true);
      let position = cClone.position.round();

      if ((slice == Constants.XSLICE_LEFT && position.x == negativeTarget) ||
        (slice == Constants.XSLICE_RIGHT && position.x == positiveTarget) ||
        (slice == Constants.YSLICE_TOP && position.y == positiveTarget) ||
        (slice == Constants.YSLICE_BOTTOM && position.y == negativeTarget) ||
        (slice == Constants.ZSLICE_FRONT && position.z == positiveTarget) ||
        (slice == Constants.ZSLICE_BACK && position.z == negativeTarget)) {
        sliceGroup.add(cClone);
        this.cubeGroupAll.remove(this.cubeGroupAll.children[i]);
      }
    }
    this.cubeGroupAll.add(sliceGroup);
    this.cubeGroupAll.rotation.setFromVector3(currentRotation);

    if (slice == Constants.XSLICE_LEFT) {
      this.threeScene.rotateOnWorldAxisX(sliceGroup, positiveRadians ? 90 : -90, .75, false, () => {
        this.colorCube.rotateSlice(slice, positiveRadians);
        this.setSceneGeometryFromColorCube(this.colorCube);
      });
    } else if (slice == Constants.XSLICE_RIGHT) {
      this.threeScene.rotateOnWorldAxisX(sliceGroup, positiveRadians ? -90 : 90, .75, false, () => {
        this.colorCube.rotateSlice(slice, positiveRadians);
        this.setSceneGeometryFromColorCube(this.colorCube);
      });

    } else if (slice == Constants.YSLICE_TOP) {
      this.threeScene.rotateOnWorldAxisY(sliceGroup, positiveRadians ? -90 : 90, .75, false, () => {
        this.colorCube.rotateSlice(slice, positiveRadians);
        this.setSceneGeometryFromColorCube(this.colorCube);
      });
    } else if (slice == Constants.YSLICE_BOTTOM) {
      this.threeScene.rotateOnWorldAxisY(sliceGroup, positiveRadians ? 90 : -90, .75, false, () => {
        this.colorCube.rotateSlice(slice, positiveRadians);
        this.setSceneGeometryFromColorCube(this.colorCube);
      });
    } else if (slice == Constants.ZSLICE_FRONT) {
      this.threeScene.rotateOnWorldAxisZ(sliceGroup, positiveRadians ? -90 : 90, .75, false, () => {
        this.colorCube.rotateSlice(slice, positiveRadians);
        this.setSceneGeometryFromColorCube(this.colorCube);
      });
    } else if (slice == Constants.ZSLICE_BACK) {
      this.threeScene.rotateOnWorldAxisZ(sliceGroup, positiveRadians ? 90 : -90, .75, false, () => {
        this.colorCube.rotateSlice(slice, positiveRadians);
        this.setSceneGeometryFromColorCube(this.colorCube);
      });
    }
  }

  getMaterial(color: string): THREE.MeshPhongMaterial {
    switch (color) {
      case Constants.BLACK:
        return this.blackPhongMaterial;
      case Constants.WHITE:
        return this.whitePhongMaterial;
      case Constants.YELLOW:
        return this.yellowPhongMaterial;
      case Constants.RED:
        return this.redPhongMaterial;
      case Constants.ORANGE:
        return this.orangePhongMaterial;
      case Constants.BLUE:
        return this.bluePhongMaterial;
      case Constants.GREEN:
        return this.greenPhongMaterial;
      default:
        return undefined;
    }
  }

  initListeners() {
    // window.addEventListener('resize', (e) => {
    //   this.cameraOptions.aspect = window.innerWidth / window.innerHeight;
    //   this.rendererOptions.size = { width: window.innerWidth, height: window.innerHeight };
    //   this.threeScene.setCameraOptions(this.cameraOptions);
    //   this.threeScene.setRendererOptions(this.rendererOptions);
    // });
 

    this.threeScene.getRenderer().domElement.addEventListener('mousedown', (e) => {
      this.previousMouseX = e.clientX;
      this.previousMouseY = e.clientY;
    });

    this.threeScene.getRenderer().domElement.addEventListener('mousemove', (e) => {
      if (this.previousMouseX + this.previousMouseY > 0) {
        if (e.clientX > this.previousMouseX) {
          this.threeScene.rotateOnWorldAxisY(this.cubeGroupAll, 3);
        } else if (e.clientX < this.previousMouseX) {
          this.threeScene.rotateOnWorldAxisY(this.cubeGroupAll, -3);
        }
        if (e.clientY > this.previousMouseY) {
          this.threeScene.rotateOnWorldAxisX(this.cubeGroupAll, 3);
        } else if (e.clientY < this.previousMouseY) {
          this.threeScene.rotateOnWorldAxisX(this.cubeGroupAll, -3);
        }
        this.previousMouseX = e.clientX;
        this.previousMouseY = e.clientY;
      }
    });

    this.threeScene.getRenderer().domElement.addEventListener('mouseup', (e) => {
      this.previousMouseX = this.previousMouseY = 0;
    });

    this.threeScene.getRenderer().domElement.addEventListener('mouseout', (e) => {
      this.previousMouseX = this.previousMouseY = 0;
    });

    window.addEventListener('keypress', (e) => {
      if(this.threeScene.isAnimating()) {
        console.log('animating')
        return;
      }
      if (e.key == 's')
        this.threeScene.rotateOnWorldAxisX(this.cubeGroupAll, 90, 1.5, false);

      if (e.key == 'w')
        this.threeScene.rotateOnWorldAxisX(this.cubeGroupAll, -90, 1.5, false);

      if (e.key == 'a')
        this.threeScene.rotateOnWorldAxisY(this.cubeGroupAll, -90, 1.5, false);

      if (e.key == 'd')
        this.threeScene.rotateOnWorldAxisY(this.cubeGroupAll, 90, 1.5, false);

      if (e.key == 'z')
        this.threeScene.rotateToDefault(this.cubeGroupAll, 0.25);

      if (e.key == 'f') {
        this.rotateSlice(Constants.ZSLICE_FRONT, true);
      }
      if (e.key == 'F') {
        this.rotateSlice(Constants.ZSLICE_FRONT, false);
      }
      if (e.key == 'b') {
        this.rotateSlice(Constants.ZSLICE_BACK, true);
      }
      if (e.key == 'B') {
        this.rotateSlice(Constants.ZSLICE_BACK, false);
      }
      if (e.key == 'l') {
        this.rotateSlice(Constants.XSLICE_LEFT, true);
      }
      if (e.key == 'L') {
        this.rotateSlice(Constants.XSLICE_LEFT, false);
      }
      if (e.key == 'r') {
        this.rotateSlice(Constants.XSLICE_RIGHT, true);
      }
      if (e.key == 'R') {
        this.rotateSlice(Constants.XSLICE_RIGHT, false);
      }
      if (e.key == 't') {
        this.rotateSlice(Constants.YSLICE_TOP, true);
      }
      if (e.key == 'T') {
        this.rotateSlice(Constants.YSLICE_TOP, false);
      }
      if (e.key == 'x') {
        this.rotateSlice(Constants.YSLICE_BOTTOM, true);
      }
      if (e.key == 'X') {
        this.rotateSlice(Constants.YSLICE_BOTTOM, false);
      }
    });
  }  
}
