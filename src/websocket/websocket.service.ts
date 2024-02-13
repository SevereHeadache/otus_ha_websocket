import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

interface SocketEvent {
  clientId: string | null;
  name: string;
  data: unknown;
}

@Injectable()
export class WebsocketService {
  private outputSubject = new Subject<SocketEvent>();
  private inputSubject = new Subject<SocketEvent>();

  addOutputEvent(event: SocketEvent) {
    this.outputSubject.next(event);
  }

  getOutputEventSubject(): Observable<SocketEvent> {
    return this.outputSubject.asObservable();
  }

  getInputEventSubject(): Subject<SocketEvent> {
    return this.inputSubject;
  }
}
