import * as Constants from './color-cube-constants';
import FaceColors from './face-colors';

export default class ColorCubeComponent {
    public faceColors: FaceColors;
    private position: any = {
        x: 0,
        y: 0,
        z: 0
    }

    constructor() {
        this.faceColors = new FaceColors();
    }

    public getFaceColorsAsJSON(): string {
        return this.faceColors.toJSON();
    }

    public setFaceColorsFromJSON(json: string) {
        this.faceColors = this.faceColors.fromJSON(json);
    }

    public setPosition(x: number, y: number, z: number) {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
    }

    public getPosition(): { x: number, y: number, z: number } {
        return this.position;
    }

    public rotateColors(slice: string, rotatePositive: boolean) {
        let top = this.faceColors.top;
        let back = this.faceColors.back;

        if ((slice == Constants.XSLICE_LEFT && rotatePositive) ||
            (slice == Constants.XSLICE_RIGHT && !rotatePositive)) {
            this.faceColors.top = this.faceColors.back;
            this.faceColors.back = this.faceColors.bottom;
            this.faceColors.bottom = this.faceColors.front;
            this.faceColors.front = top;
        } else if ((slice == Constants.XSLICE_RIGHT && rotatePositive) ||
            (slice == Constants.XSLICE_LEFT && !rotatePositive)) {
            this.faceColors.top = this.faceColors.front;
            this.faceColors.front = this.faceColors.bottom;
            this.faceColors.bottom = this.faceColors.back;
            this.faceColors.back = top;
        }

        if ((slice == Constants.YSLICE_TOP && rotatePositive) ||
            (slice == Constants.YSLICE_BOTTOM && !rotatePositive)) {
            this.faceColors.back = this.faceColors.left;
            this.faceColors.left = this.faceColors.front;
            this.faceColors.front = this.faceColors.right;
            this.faceColors.right = back;
        } else if ((slice == Constants.YSLICE_BOTTOM && rotatePositive) ||
            (slice == Constants.YSLICE_TOP && !rotatePositive)) {
            this.faceColors.back = this.faceColors.right;
            this.faceColors.right = this.faceColors.front;
            this.faceColors.front = this.faceColors.left;
            this.faceColors.left = back;
        }

        if ((slice == Constants.ZSLICE_FRONT && rotatePositive) ||
            (slice == Constants.ZSLICE_BACK && !rotatePositive)) {
            this.faceColors.top = this.faceColors.left;
            this.faceColors.left = this.faceColors.bottom;
            this.faceColors.bottom = this.faceColors.right;
            this.faceColors.right = top;
        } else if ((slice == Constants.ZSLICE_BACK && !rotatePositive) ||
            (slice == Constants.ZSLICE_FRONT && rotatePositive)) {
            this.faceColors.top = this.faceColors.right;
            this.faceColors.right = this.faceColors.bottom;
            this.faceColors.bottom = this.faceColors.left;
            this.faceColors.left = top;
        }
    }
}
