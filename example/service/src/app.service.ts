import { Injectable } from '@nestjs/common';
import { SampleService } from '@rvbd-nestjs/sample';

@Injectable()
export class AppService {
  private readonly spanwnedAt: Date;
  constructor(private readonly sampleService: SampleService) {
    this.spanwnedAt = new Date();
  }
  root(): string {
    const sampleKey = this.sampleService.getSampleOptionsKey();
    return `Hello World! ${sampleKey} (${this.spanwnedAt})`;
  }
}
