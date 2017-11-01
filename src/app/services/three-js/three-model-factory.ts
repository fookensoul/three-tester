import { Injectable } from '@angular/core';
import { Vector3 } from 'three';
import { CameraOptions } from '../../models/three-js/camera-options';
import { RendererOptions } from '../../models/three-js/renderer-options';
import { ModelFactory, Model } from 'ngx-model';
import { Observable } from 'rxjs';

@Injectable()
export class ThreeModelFactory {

  cameraOptionsModel: Model<CameraOptions>;
  cameraOptionsModel$: Observable<CameraOptions>;

  rendererOptionsModel: Model<RendererOptions>;
  rendererOptionsModel$: Observable<RendererOptions>;

  constructor(private cameraModelFactory: ModelFactory<CameraOptions>,
    private rendererModelFactory: ModelFactory<RendererOptions>
  ) {
    this.cameraOptionsModel = cameraModelFactory.create(new CameraOptions());
    this.cameraOptionsModel$ = this.cameraOptionsModel.data$;

    this.rendererOptionsModel = rendererModelFactory.create(new RendererOptions());
    this.rendererOptionsModel$ = this.rendererOptionsModel.data$;
  }

  public setCameraOptions(options: CameraOptions) {
    this.cameraOptionsModel.set(options);
  }

  public setRendererOptions(options: RendererOptions) {
    this.rendererOptionsModel.set(options);
  }
}
