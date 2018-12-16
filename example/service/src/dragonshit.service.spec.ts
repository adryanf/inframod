import { Test, TestingModule } from '@nestjs/testing';
import { DragonshitService } from './dragonshit.service';

describe('DragonshitService', () => {
  let service: DragonshitService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DragonshitService],
    }).compile();
    service = module.get<DragonshitService>(DragonshitService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
