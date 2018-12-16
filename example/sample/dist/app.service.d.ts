import { SampleService } from '@rvbd-nestjs/sample';
export declare class AppService {
    private readonly sampleService;
    private readonly spanwnedAt;
    constructor(sampleService: SampleService);
    root(): string;
}
