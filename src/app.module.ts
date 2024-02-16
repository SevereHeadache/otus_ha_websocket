import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketModule } from './websocket/websocket.module';
import { RmqModule } from './rmq/rmq.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [WebsocketModule, RmqModule, HttpModule],
  controllers: [AppController],
  providers: [AppService, WebsocketModule, RmqModule],
})
export class AppModule {}
