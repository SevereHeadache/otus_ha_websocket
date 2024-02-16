import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { SocketEvent, WebsocketService } from './websocket/websocket.service';
import { RmqService } from './rmq/rmq.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private logger = new Logger('AppService');
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly rmqService: RmqService,
    private readonly httpService: HttpService,
  ) {}

  onApplicationBootstrap() {
    this.websocketService.getInputEventSubject().subscribe((event) => {
      this.onWSEvent(event);
    });
  }

  private onWSEvent(event: SocketEvent) {
    this.logger.debug({ event });
    if (event.name == 'connect' && event.data?.token) {
      this.requestUserInfo(event.data?.token).subscribe(
        (response) => {
          this.logger.debug({ responseData: response.data });
          if (response.data?.id) {
            this.addListenerForRMQ(response.data?.id, event.clientId);
          }
        },
        (error) => {
          console.log({ error });
        },
      );
    }
  }

  private requestUserInfo(token: string) {
    return this.httpService.get('http://0.0.0.0:8888/me', {
      headers: {
        'auth-token': token,
      },
    });
  }

  private addListenerForRMQ(userId: string, clientId) {
    this.rmqService.getConsumer$(userId).subscribe((msg) => {
      this.logger.debug(msg);
      this.websocketService.addOutputEvent({
        clientId,
        name: 'message',
        data: msg.body,
      });
    });
  }
}
