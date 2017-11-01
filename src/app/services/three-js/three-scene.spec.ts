import { TestBed, inject } from '@angular/core/testing';

import { ThreeScene } from './three-scene';

describe('ThreeScene', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThreeScene]
    });
  });

  it('should be created', inject([ThreeScene], (service: ThreeScene) => {
    expect(service).toBeTruthy();
  }));
});
