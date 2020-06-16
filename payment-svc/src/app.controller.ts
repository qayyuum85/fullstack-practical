import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Controller()
export class AppController {
  @MessagePattern({ cmd: 'getPayment' })
  getPayment(orderId: string) {
    const getRandom = max => Math.floor(Math.random() * Math.floor(max));

    return of({
      orderId,
      status: !!getRandom(2) ? 'CONFIRMED': 'DECLINED',
    }).pipe(delay(1000));
  }
}
