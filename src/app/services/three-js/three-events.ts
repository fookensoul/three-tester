import { Injectable } from '@angular/core';
import { CameraOptions } from '../../models/three-js/camera-options';
import { RendererOptions } from '../../models/three-js/renderer-options';
import { } from ''

@Injectable()
export class ThreeEvents {

  constructor() { }

  // public addWindowListeners(element: HTMLElement,
  //                     targetObjects: {
  //                       cameraOptions: CameraOptions,
  //                       renderOptions: RendererOptions
  //                     }) {
  //                       element.addEventListener('resize', (e) => {
  //                         cameraOptions.aspect = window.innerWidth / window.innerHeight;
  //                         rendererOptions.size = { width: window.innerWidth, height: window.innerHeight };
  //                         threeScene.setCameraOptions(cameraOptions);
  //                         threeScene.setRendererOptions(rendererOptions);
  //                       });
                    
  //                       element.addEventListener('mousedown', (e) => {
  //                         previousMouseX = e.clientX;
  //                         previousMouseY = e.clientY;
  //                       });
                    
  //                       element.addEventListener('mousemove', (e) => {
  //                         if (previousMouseX + previousMouseY > 0) {
  //                           if (e.clientX > previousMouseX) {
  //                             cubeGroupAll.rotateY(0.03);
  //                           } else if (e.clientX < previousMouseX) {
  //                             cubeGroupAll.rotateY(-0.03);
  //                           }
  //                           if (e.clientY > previousMouseY) {
  //                             //cubeGroupAll.rotateX(0.03);
  //                           } else if (e.clientY < previousMouseY) {
  //                             //cubeGroupAll.rotateX(-0.03);
  //                           }
  //                           previousMouseX = e.clientX;
  //                           previousMouseY = e.clientY;
  //                         }
  //                       });
                    
  //                       element.addEventListener('mouseup', (e) => {
  //                         previousMouseX = previousMouseY = 0;
  //                       });
  //                     }
  // }
}
