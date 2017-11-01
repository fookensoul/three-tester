import { TestBed, inject } from '@angular/core/testing';

import { ThreeEvents } from './three-events';

describe('ThreeEvents', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThreeEvents]
    });
  });

  it('should be created', inject([ThreeEvents], (service: ThreeEvents) => {
    expect(service).toBeTruthy();
  }));
});
