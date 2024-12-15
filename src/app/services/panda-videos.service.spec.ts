import { TestBed } from '@angular/core/testing';

import { PandaVideosService } from './panda-videos.service';

describe('PandaVideosService', () => {
  let service: PandaVideosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PandaVideosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
