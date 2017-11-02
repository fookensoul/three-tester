import ColorCubeComponent from './color-cube-component';
import FaceColors from './face-colors';
import * as Constants from './color-cube-constants';


export default class ColorCube {
    private cubes: ColorCubeComponent[];
    public componentSize: number;

    constructor(componentSize: number) {
        this.componentSize = componentSize;
        this.cubes = new Array<ColorCubeComponent>();
        this.init();
    }

    init() {
        for (var x = -this.componentSize; x <= this.componentSize; x += this.componentSize) {
            for (var y = -this.componentSize; y <= this.componentSize; y += this.componentSize) {
                for (var z = -this.componentSize; z <= this.componentSize; z += this.componentSize) {
                    let cube = new ColorCubeComponent();

                    if (x == -this.componentSize) {
                        cube.faceColors.left = Constants.RED;
                    } else if (x == this.componentSize) {
                        cube.faceColors.right = Constants.ORANGE;
                    }
                    if (y == -this.componentSize) {
                        cube.faceColors.bottom = Constants.YELLOW;
                    } else if (y == this.componentSize) {
                        cube.faceColors.top = Constants.WHITE;
                    }
                    if (z == -this.componentSize) {
                        cube.faceColors.back = Constants.BLUE;
                    } else if (z == this.componentSize) {
                        cube.faceColors.front = Constants.GREEN;
                    }
                    cube.setPosition(x, y, z);
                    this.cubes.push(cube);
                }
            }
        }
    }

    public getCubeComponents(): ColorCubeComponent[] {
        return this.cubes;
    }

    public rotateSlice(slice: string, positiveRadians: boolean) {
        this.cubes.forEach(c => {
            let position: { x: number, y: number, z: number } = c.getPosition();
            if (slice == Constants.XSLICE_LEFT && position.x == -this.componentSize) {
                c.setPosition(position.x,
                    positiveRadians ? -position.z : position.z,
                    positiveRadians ? position.y : -position.y);
                c.rotateColors(slice, positiveRadians);
            } else if(slice == Constants.XSLICE_RIGHT && position.x == this.componentSize) {
                c.rotateColors(slice, positiveRadians);
                c.setPosition(position.x,
                    positiveRadians ? position.z : -position.z,
                    positiveRadians ? -position.y : position.y);
            } else if(slice == Constants.YSLICE_TOP && position.y == this.componentSize) {
                c.rotateColors(slice, positiveRadians);
                c.setPosition(positiveRadians ? -position.z : position.z,
                    position.y,
                    positiveRadians ? position.x : -position.x);
            } else if(slice == Constants.YSLICE_BOTTOM && position.y == -this.componentSize) {
                c.rotateColors(slice, positiveRadians);
                c.setPosition(positiveRadians ? position.z : -position.z,
                    position.y,
                    positiveRadians ? -position.x : position.x);
            } else if(slice == Constants.ZSLICE_FRONT && position.z == this.componentSize) {
                c.rotateColors(slice, positiveRadians);
                c.setPosition(positiveRadians ? position.y : -position.y,
                    positiveRadians ? -position.x : position.x,
                    position.z);
            } else if(slice == Constants.ZSLICE_BACK && position.z == -this.componentSize) {
                c.rotateColors(slice, positiveRadians);
                c.setPosition(positiveRadians ? -position.y : position.y,
                    positiveRadians ? position.x : -position.x,
                    position.z);
            }
        });
    }    
}
