import { TestBed } from '@angular/core/testing';

import { ServerSocket } from './server.service';

describe('ServerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerSocket = TestBed.get(ServerSocket);
    expect(service).toBeTruthy();
  });
});
