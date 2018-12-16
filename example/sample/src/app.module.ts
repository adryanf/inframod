import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SampleModule } from '@rvbd-nestjs/sample';
import { DragonshitService } from './dragonshit.service';

@Module({
  imports: [SampleModule.forRoot({ sampleKey: 'sample value' })],
  controllers: [AppController],
  providers: [AppService, DragonshitService],
})
export class AppModule {}
