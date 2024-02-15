import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { RmqModule } from 'src/rmq/rmq.module';

@Module({
  imports: [RmqModule],
  providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
