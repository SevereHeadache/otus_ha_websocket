import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketModule } from './websocket/websocket.module';
import { RmqModule } from './rmq/rmq.module';

@Module({
  imports: [WebsocketModule, RmqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
