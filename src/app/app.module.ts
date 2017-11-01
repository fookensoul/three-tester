import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SceneComponent } from './components/three-js/scene/scene.component';
import { SceneEditorComponent } from './components/three-js/scene-editor/scene-editor.component';

import { ThreeScene } from './services/three-js/three-scene';
import { ThreeEvents } from './services/three-js/three-events'

import { ThreeModelFactory } from './services/three-js/three-model-factory';
import { ModelFactory } from 'ngx-model';

@NgModule({
  declarations: [
    AppComponent,
    SceneComponent,
    SceneEditorComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    ThreeScene,
    ThreeEvents,
    ModelFactory,
    ThreeModelFactory
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
