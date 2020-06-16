import { Repository, EntityRepository } from 'typeorm';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order-status.enum';
import { InternalServerErrorException, Logger } from '@nestjs/common';

const logger = new Logger('EntityRepository');

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
  async getOrders(): Promise<Order[]> {
    const query = this.createQueryBuilder('order');
    query.orderBy('order.updatedOn', 'DESC');
    try {
      const orders = await query.getMany();
      return orders;
    } catch (error) {
      logger.error('Unable to search for records', error);
      throw new InternalServerErrorException();
    }
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { title, description, price } = createOrderDto;
    const order: Order = new Order();
    order.title = title;
    order.description = description;
    order.price = price;
    order.status = OrderStatus.CREATED;
    order.createdOn = new Date();

    try {
      await order.save();
      return order;
    } catch (error) {
      logger.error('Unable to search for records', error);
      throw new InternalServerErrorException();
    }
  }
}
