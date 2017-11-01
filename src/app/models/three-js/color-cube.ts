import { CubeGeometry, Mesh, Material, MeshPhongMaterial } from 'three';
export const TOP: number = 2;
export const BOTTOM: number = 3;
export const LEFT: number = 1;
export const RIGHT: number = 0;
export const FRONT: number = 4;
export const BACK: number = 5;

export class ColorCube extends Mesh {

    constructor(geometry: CubeGeometry,
        materials: Material[]) {

        super(geometry, materials);
    }

    public setSideMaterial(side: number, material: MeshPhongMaterial) {
        this.material[side] = (material as MeshPhongMaterial).clone();
        //console.log(material.map.image)
    }

    public rotateMesh(fromCube: ColorCube, 
                      cubeSize: number, 
                      xTarget: number, 
                      yTarget: number, 
                      zTarget: number, 
                      radians: number) {
        if (Math.abs(xTarget) == cubeSize) {
            if (radians > 0) {
                let fromCubeTop = (fromCube.material[TOP] as MeshPhongMaterial).clone();
                this.setSideMaterial(TOP, fromCube.material[BACK]);
                this.setSideMaterial(BACK, fromCube.material[BOTTOM]);
                this.setSideMaterial(BOTTOM, fromCube.material[FRONT]);
                this.setSideMaterial(FRONT, fromCubeTop);
                this.setSideMaterial(LEFT, fromCube.material[LEFT]);
                this.setSideMaterial(RIGHT, fromCube.material[RIGHT]);
                console.log((fromCube.material[BOTTOM] as MeshPhongMaterial).map.image);
            } else {
                this.setSideMaterial(TOP, fromCube.material[FRONT]);
                this.setSideMaterial(FRONT, fromCube.material[BOTTOM]);
                this.setSideMaterial(BOTTOM, fromCube.material[BACK]);
                this.setSideMaterial(BACK, fromCube.material[TOP]);
                this.setSideMaterial(LEFT, fromCube.material[LEFT]);
                this.setSideMaterial(RIGHT, fromCube.material[RIGHT]);
            }
        } else if (Math.abs(yTarget) == cubeSize) {
            if (radians > 0) {
                this.setSideMaterial(FRONT, fromCube.material[RIGHT]);
                this.setSideMaterial(RIGHT, fromCube.material[BACK]);
                this.setSideMaterial(BACK, fromCube.material[LEFT]);
                this.setSideMaterial(LEFT, fromCube.material[FRONT]);
                this.setSideMaterial(TOP, fromCube.material[TOP]);
                this.setSideMaterial(BOTTOM, fromCube.material[BOTTOM]);
            } else {
                this.setSideMaterial(FRONT, fromCube.material[LEFT]);
                this.setSideMaterial(LEFT, fromCube.material[BACK]);
                this.setSideMaterial(BACK, fromCube.material[RIGHT]);
                this.setSideMaterial(RIGHT, fromCube.material[FRONT]);
                this.setSideMaterial(TOP, fromCube.material[TOP]);
                this.setSideMaterial(BOTTOM, fromCube.material[BOTTOM]);
            }
        } else if (zTarget == cubeSize) {
            if (radians > 0) {

            } else {

            }
        }
    }
}
