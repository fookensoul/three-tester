import * as Constants from './color-cube-constants';

export default class FaceColors {
    public top: string = Constants.BLACK;
    public bottom: string = Constants.BLACK;
    public left: string = Constants.BLACK;
    public right: string = Constants.BLACK;
    public front: string = Constants.BLACK;
    public back: string = Constants.BLACK;

    constructor(){}

    public toJSON(): string {
        return JSON.stringify(this);
    }

    public fromJSON(json: string): FaceColors {
        return JSON.parse(json);
    }
}