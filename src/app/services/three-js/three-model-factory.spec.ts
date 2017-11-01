import { TestBed, inject } from '@angular/core/testing';

import { ThreeModelFactory } from './three-model-factory';

describe('ThreeModelFactory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThreeModelFactory]
    });
  });

  it('should be created', inject([ThreeModelFactory], (service: ThreeModelFactory) => {
    expect(service).toBeTruthy();
  }));
});
