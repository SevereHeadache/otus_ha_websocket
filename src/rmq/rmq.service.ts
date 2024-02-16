import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import Connection, { Consumer, Publisher } from 'rabbitmq-client';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class RmqService implements OnApplicationShutdown {
  private logger = new Logger('RMQ Service');
  private rabbit: Connection;
  private consuners: { [id: string]: Consumer } = {};
  private publishers: { [id: string]: Publisher } = {};

  private consuners$: { [id: string]: Observable<any> } = {};
  private publishers$: { [id: string]: Subject<any> } = {};

  constructor() {
    this.rabbit = new Connection('amqp://guest:guest@localhost:5672');
    this.rabbit.on('error', (err) => {
      this.logger.debug('RabbitMQ connection error: ' + err);
    });
    this.rabbit.on('connection', () => {
      this.logger.debug('Connection successfully (re)established');
    });
  }

  async onApplicationShutdown() {
    Object.values(this.publishers).map(async (publisher: Publisher) => {
      await publisher.close();
    });
    Object.values(this.consuners).map(async (consuner: Consumer) => {
      await consuner.close();
    });

    await this.rabbit.close();
  }

  getPublisher$(userId): Subject<any> {
    if (this.publishers$[userId]) {
      return this.publishers$[userId];
    } else {
      this.publishers[userId] = this.rabbit.createPublisher({
        confirm: true,
        maxAttempts: 2,
        exchanges: [{ exchange: 'ws', type: 'topic', durable: true }],
      });

      const messages = new Subject<any>();
      messages.subscribe((data) => {
        this.logger.debug('publish message: ' + JSON.stringify(data));
        this.publishers[userId].send(
          { exchange: 'ws', routingKey: 'posted.' + userId },
          data,
        );
      });

      this.publishers$[userId] = messages;

      return messages;
    }
  }

  getConsumer$(userId): Observable<any> {
    if (this.consuners$[userId]) {
      return this.consuners$[userId];
    } else {
      const messages = new Subject<any>();
      this.consuners[userId] = this.rabbit.createConsumer(
        {
          queue: 'user-posts',
          queueOptions: { durable: true },
          qos: { prefetchCount: 2 },
          exchanges: [{ exchange: 'ws', type: 'topic', durable: true }],
          queueBindings: [{ exchange: 'ws', routingKey: 'posted.' + userId }],
        },
        async (msg) => {
          this.logger.debug('recive message: ' + JSON.stringify(msg));
          messages.next(msg);
        },
      );

      this.consuners[userId].on('error', (err) => {
        this.logger.log('consumer error (user-posts): ' + err);
      });
      this.consuners$[userId] = messages.asObservable();

      return this.consuners$[userId];
    }
  }
}
