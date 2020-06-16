import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './order-status.enum';
import { Order } from './order.entity';
import { OrderStatusValidationPipe } from './pipes/order-status.pipe';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  async getOrders(): Promise<Order[]> {
    return this.orderService.getOrders();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }

  @Patch('/:id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body('status', OrderStatusValidationPipe) status: OrderStatus,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(id, status);
  }

  @Delete('/:id')
  deleteOrder(@Param('id') id: string): Promise<void> {
    return this.orderService.deleteOrder(id);
  }
}
