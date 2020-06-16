import {
  Injectable,
  NotFoundException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReceivedPayment, PaymentStatus } from './order.model';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order-status.enum';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRepository } from './order.repository';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('PAYMENT_SERVICE') private readonly paymentService: ClientProxy,
    @InjectRepository(OrderRepository) private orderRepository: OrderRepository,
  ) {}

  getOrders(): Promise<Order[]> {
    return this.orderRepository.getOrders();
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Orders with ID ${id} not found`);
    }

    return order;
  }

  createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderRepository.createOrder(createOrderDto);
  }

  async deleteOrder(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException();
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderById(id);

    if (status === OrderStatus.CANCELLED || status === OrderStatus.DELIVERED) {
      throw new Error('Unable to update status as order is invalid');
    }

    order.status = status;
    order.updatedOn = new Date();

    if (order.status === OrderStatus.CONFIRMED) {
      this.getPayment(order.id);
    }

    try {
      await order.save();
      return order;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private getPayment(orderId: string) {
    const pattern = { cmd: 'getPayment' };
    const payload = orderId;
    this.paymentService
      .send<ReceivedPayment>(pattern, payload)
      .pipe(
        map(message => {
          const { orderId, status } = message;
          return {
            orderId,
            status,
          };
        }),
      )
      .subscribe(
        (data: ReceivedPayment) => {
          const orderStatus =
            data.status === PaymentStatus.CONFIRMED
              ? OrderStatus.DELIVERED
              : OrderStatus.CANCELLED;

          this.updateOrderStatus(data.orderId, orderStatus);
        },
        error => {
          throw new InternalServerErrorException(error);
        },
      );
  }
}
