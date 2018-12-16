import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from '@rvbd-nestjs/sample';

describe('AppController', () => {
  let app: TestingModule;
  let appController: AppController;
  let appService: AppService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [SampleModule.forRoot({ sampleKey: 'sample-value-test' })],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const result = 'Hello World!';
      jest.spyOn(appService, 'root').mockImplementation(() => result);
      expect(appController.root()).toBe('Hello World!');
    });
  });
});
