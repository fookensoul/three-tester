import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { ThreeModelFactory } from '../three-js/three-model-factory';
import * as THREE from 'three';
import { CameraOptions } from '../../models/three-js/camera-options';
import { RendererOptions } from '../../models/three-js/renderer-options';
import { ColorCube } from '../../models/three-js/color-cube';
import * as _ from 'lodash';

@Injectable()
export class ThreeScene {

  cameraOptionsSubscription: Subscription;
  rendererOptionsSubscription: Subscription;

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private cameraOptions: CameraOptions;
  private rendererOptions: RendererOptions;
  private animationRef;
  private clientFunction: Function;

  public axisX = new THREE.Vector3(1, 0, 0).normalize();
  public axisY = new THREE.Vector3(0, 1, 0).normalize();
  public axisZ = new THREE.Vector3(0, 0, 1).normalize();
  public quaternion = new THREE.Quaternion();
  private renderQueue: [{ func?: Function, callBack?: Function, finished?: boolean, currentFrame?: number, totalFrames?: number, async?: boolean }];

  constructor(private threeModelFactory: ThreeModelFactory) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    this.renderer = new THREE.WebGLRenderer();
    let light = new THREE.AmbientLight(0xffffff, 0.75);

    this.renderQueue = [{}];

    this.scene.add(this.camera);
    this.scene.add(light);
    var axisHelper = new THREE.AxisHelper();
    this.scene.add(axisHelper);
    this.subscribeModelFactories();
  }

  public subscribeModelFactories() {
    this.cameraOptionsSubscription = this.threeModelFactory.cameraOptionsModel$
      .subscribe((options) => this.cameraOptions = options);

    this.rendererOptionsSubscription = this.threeModelFactory.rendererOptionsModel$
      .subscribe((options) => this.rendererOptions = options);
  }

  public updateSceneMatrix() {
    this.scene.updateMatrix();
    this.scene.updateMatrixWorld(true);
  }


  public addToScene(object: THREE.Object3D) {
    this.scene.add(object);
  }

  public removeFromScene(object: THREE.Object3D) {
    cancelAnimationFrame(this.animationRef);
    this.scene.remove(object);
    for(let i = object.children.length - 1; i >=0; i--) {
      object.remove(object.children[i]);
    }
    this.render(this.clientFunction);
  }

  public removeFromSceneByName(objectName: string) {
    let object = this.scene.getObjectByName(objectName);
    this.removeFromScene(object);
  }  

  public getRenderer() {
    return _.cloneDeep(this.renderer);
  }

 
  public getSceneObjectByName(objectName: string) {
    return this.scene.getObjectByName(objectName);
  } 


  public setCameraOptions(options: CameraOptions) {
    this.camera.aspect = options.aspect;
    this.camera.fov = options.fov;
    this.camera.near = options.near;
    this.camera.far = options.far;
    this.camera.position.set(options.position.x,
      options.position.y,
      options.position.z);

    this.camera.lookAt(new THREE.Vector3(options.lookAt.x,
      options.lookAt.y,
      options.lookAt.z));

    this.camera.updateProjectionMatrix();
    this.threeModelFactory.setCameraOptions(options);
  }

  public setRendererOptions(options: RendererOptions) {
    this.renderer.setClearColor(options.clearColor);
    this.renderer.setSize(options.size.width,
      options.size.height);

    this.camera.updateProjectionMatrix();
    this.threeModelFactory.setRendererOptions(options);
  }

  public getWorldCoords(object: THREE.Object3D): THREE.Vector3 {
    let bbox = new THREE.Vector3();
    bbox.setFromMatrixPosition(object.matrixWorld);
    return bbox;
  }

  public rotateToDefault(object: THREE.Object3D, seconds?: number, async?: boolean) {
    let numFrames = seconds ? seconds * 60 : 1;
    let xFactor = -object.rotation.x / numFrames;
    let yFactor = -object.rotation.y / numFrames;
    let zFactor = -object.rotation.z / numFrames;

    if (xFactor != 0 && yFactor != 0 && zFactor != 0)
      this.addToRenderQueue(numFrames, async, () => {
        object.rotation.x += object.rotation.x != 0 ? xFactor : 0;
        object.rotation.y += object.rotation.y != 0 ? yFactor : 0;
        object.rotation.z += object.rotation.z != 0 ? zFactor : 0;
      }, () => {
        object.rotation.x = object.rotation.y = object.rotation.z = 0.0;
        object.updateMatrix();
      });
  }

  public rotateUntil(object: THREE.Object3D, axis: THREE.Vector3, totalAngle: number, seconds?: number, async?: boolean) {
    //object.rotateOnAxis(axis, totalAngle);
    let numFrames = seconds ? seconds * 60 : 1;
    this.addToRenderQueue(numFrames, async, () => {
      this.quaternion.setFromAxisAngle(axis, (totalAngle / numFrames));
      object.quaternion.premultiply(this.quaternion);
    });
  }

  public rotateOnWorldAxisX(object: THREE.Object3D, degrees: number, seconds?: number, async?: boolean, callBack?: Function) {
    let numFrames = degrees == 0 ? 0 : seconds ? seconds * 60 : 1;
    this.addToRenderQueue(numFrames, async, () => {
      this.quaternion.setFromAxisAngle(this.axisX, (degrees / numFrames) * THREE.Math.DEG2RAD);
      object.quaternion.premultiply(this.quaternion);
      object.matrixWorldNeedsUpdate = true;
    }, callBack);
  }

  public rotateX(object: THREE.Object3D, degrees: number, seconds?: number, async?: boolean, callBack?: Function) {
    let numFrames = degrees == 0 ? 0 : seconds ? seconds * 60 : 1;
    this.addToRenderQueue(numFrames, async, () => {
      object.rotateX(THREE.Math.degToRad(degrees/ numFrames));
    }, callBack);
  }  

  public rotateOnWorldAxisY(object: THREE.Object3D, degrees: number, seconds?: number, async?: boolean, callBack?: Function) {
    let numFrames = degrees == 0 ? 0 : seconds ? seconds * 60 : 1;
    this.addToRenderQueue(numFrames, async, () => {
      this.quaternion.setFromAxisAngle(this.axisY, (degrees / numFrames) * THREE.Math.DEG2RAD);
      object.quaternion.premultiply(this.quaternion);
    }, callBack);
  }

  public rotateOnWorldAxisZ(object: THREE.Object3D, degrees: number, seconds?: number, async?: boolean, callBack?: Function) {
    let numFrames = degrees == 0 ? 0 : seconds ? seconds * 60 : 1;
    this.addToRenderQueue(numFrames, async, () => {
      this.quaternion.setFromAxisAngle(this.axisZ, (degrees / numFrames) * THREE.Math.DEG2RAD);
      object.quaternion.premultiply(this.quaternion);
    }, callBack);
  }

  public addToRenderQueue(numFrames: number, async: boolean, func: Function, callBack?: Function) {
    this.renderQueue.push({
      func: func,
      callBack: callBack,
      currentFrame: 0,
      totalFrames: numFrames,
      async: async ? async : false
    });
  }

  public render(clientFunc: Function) {
    this.clientFunction = clientFunc;
    this.animationRef = requestAnimationFrame(() => this.render(clientFunc));
    this.renderer.render(this.scene, this.camera);
    this.animate(clientFunc);
  }

  animate(clientFunc?: Function) {
    if(clientFunc)
      clientFunc();
    //queued async
    for (let x = 0; x < this.renderQueue.length; x++) {
      if (!this.renderQueue[x].finished) {

        if (this.renderQueue[x].currentFrame < this.renderQueue[x].totalFrames) {
          if (this.renderQueue[x].currentFrame % 60 == 0) {
            //console.log('rendering async');
          }
          this.renderQueue[x].currentFrame++;
          this.renderQueue[x].func();
          if(!this.renderQueue[x].async) {
            break;
          }
        } else if (this.renderQueue[x].currentFrame == this.renderQueue[x].totalFrames) {
          if (this.renderQueue[x].callBack) {
            this.renderQueue[x].callBack();
          }
          this.renderQueue[x].finished = true;
        }
      }
    }
  }


  
}
