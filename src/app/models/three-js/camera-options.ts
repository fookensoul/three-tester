import { Vector3 } from 'three';

export class CameraOptions {
    constructor(
        public fov?: number,
        public aspect?: number,
        public near?: number,
        public far?: number,
        public position?: {
            x: number,
            y: number,
            z: number
        },
        public lookAt?: Vector3
    ) {}
}