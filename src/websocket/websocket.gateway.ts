import { Logger, OnApplicationShutdown } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Subscription } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayInit, OnApplicationShutdown {
  private eventSubscription: Subscription;
  private logger = new Logger('WebSocketGateway');

  constructor(private readonly service: WebsocketService) {}

  afterInit(server: Server): void {
    this.eventSubscription = this.service.getOutputEventSubject().subscribe({
      next: (event) => {
        if (event.clientId) {
          server.sockets.sockets
            .get(event.clientId)
            .emit(event.name, event.data);
        } else {
          server.emit(event.name, event.data);
        }
      },
      error: (err) => server.emit('exception', err),
    });
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    this.logger.debug({ clientId: client.id, name: '', data });
    this.service
      .getInputEventSubject()
      .next({ clientId: client.id, name: '', data });
  }

  onApplicationShutdown() {
    this.eventSubscription.unsubscribe();
  }
}
