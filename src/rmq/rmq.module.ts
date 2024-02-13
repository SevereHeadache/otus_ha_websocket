import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([{ name: 'RMQ_SERVICE', transport: Transport.RMQ }]),
  ],
})
export class RmqModule {}
