import { TestBed } from '@angular/core/testing';

import { Inter } from './inter';

describe('Inter', () => {
  let service: Inter;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Inter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
