import { TestBed } from '@angular/core/testing';

import { SubreportService } from './subreport.service';

describe('SubreportService', () => {
  let service: SubreportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubreportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
