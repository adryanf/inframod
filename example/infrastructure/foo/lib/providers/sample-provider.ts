import { Injectable, Inject } from '@nestjs/common';
import { SampleOptions } from '../interfaces/sample-options.interface';
import { SAMPLE_OPTIONS } from '../sample.constants';
import * as uuid from 'uuid/v4';

@Injectable()
export class SampleService {
    constructor(
        @Inject(SAMPLE_OPTIONS)
        private readonly sampleOptions: SampleOptions
    ){}
    public getSampleOptionsKey(): string {
        const generatedId = uuid();
        const sampleOptionsKey = this.sampleOptions.sampleKey ? this.sampleOptions.sampleKey : 'default';
        return `${generatedId} - ${sampleOptionsKey}`;
    }

}