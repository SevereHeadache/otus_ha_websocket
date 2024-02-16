import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebsocketModule } from './websocket/websocket.module';
import { RmqModule } from './rmq/rmq.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    WebsocketModule,
    RmqModule,
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketModule, RmqModule],
})
export class AppModule {}
