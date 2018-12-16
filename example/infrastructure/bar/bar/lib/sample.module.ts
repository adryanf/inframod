import { DynamicModule, Module } from '@nestjs/common';
import { SampleOptions } from './interfaces/sample-options.interface';
import { SampleService } from './providers/sample-provider';
import { SAMPLE_OPTIONS } from './sample.constants';

@Module({})
export class SampleModule {
  static forRoot(options?: SampleOptions): DynamicModule {

    const sampleOptions = {
      provide: SAMPLE_OPTIONS,
      useValue: options
    };

    return {
      module: SampleModule,
      providers: [SampleService, sampleOptions],
      exports: [SampleService]
    };
  }
}
