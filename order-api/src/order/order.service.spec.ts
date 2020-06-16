import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { ClientsModule, Transport, ClientProxy, ClientNats } from '@nestjs/microservices';
import { OrderStatus } from './order-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockOrderRepository = () => ({
  getOrders: jest.fn(),
  findOne: jest.fn(),
  createOrder: jest.fn(),
  delete: jest.fn(),
  updateOrderStatus: jest.fn(),
});

const mockMicroservice = () => ({
  send:jest.fn()
})

describe('OrderService', () => {
  let orderService: OrderService;
  let orderRepository;
  let microservice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientsModule.register([
        {
          name: 'PAYMENT_SERVICE',
          transport: Transport.TCP,
          options: {
            host: '127.0.0.1',
            port: 8888,
          },
        },
      ])],
      providers: [
        {provide: ClientProxy, useFactory:mockMicroservice},
        OrderService,
        { provide: OrderRepository, useFactory: mockOrderRepository },
      ],
    }).compile();

    microservice = await module.get<ClientProxy>(ClientProxy);
    orderService = await module.get<OrderService>(OrderService);
    orderRepository = await module.get<OrderRepository>(OrderRepository);
  });

  describe('getOrders', () => {
    it('get orders from repository', async () => {
      orderRepository.getOrders.mockResolvedValue('test value');
      expect(orderRepository.getOrders).not.toHaveBeenCalled();

      const result = await orderService.getOrders();
      expect(orderRepository.getOrders).toHaveBeenCalled();
      expect(result).toEqual('test value');
    });
  });

  describe('getOrderById', () => {
    it('should call orderRepository.findOne and return an order', async () => {
      orderRepository.findOne.mockResolvedValue('some order');
      expect(orderRepository.findOne).not.toHaveBeenCalled();

      const result = await orderService.getOrderById('someid');
      expect(orderRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual('some order');
    });

    it('throw an error when not found', async () => {
      orderRepository.findOne.mockResolvedValue(null);
      expect(orderService.getOrderById('someId')).rejects.toThrow();
    });
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const mockOrder = {
        title: 'mock title',
        description: 'mock description',
        price: 200,
      };
      orderRepository.createOrder.mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(mockOrder);
      expect(orderRepository.createOrder).toHaveBeenCalled();
      expect(orderRepository.createOrder).toHaveBeenCalledWith(mockOrder);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const save = jest.fn().mockResolvedValue(true);
      orderService.getOrderById = jest.fn().mockResolvedValue({
        status: OrderStatus.CREATED,
        save,
      });

      expect(save).not.toHaveBeenCalled();
      orderRepository.updateOrderStatus.mockResolvedValue('some value');
      const result = await orderService.updateOrderStatus(
        'some id',
        OrderStatus.CONFIRMED,
      );
      expect(orderService.getOrderById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(OrderStatus.CONFIRMED);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      orderRepository.delete.mockResolvedValue({ affected: 1 });

      await orderService.deleteOrder('some id');
      expect(orderRepository.delete).toHaveBeenCalled();
      expect(orderRepository.delete).toHaveBeenCalledWith('some id');
    });

    it('should throw an exception when no task is deleted', () => {
      orderRepository.delete.mockResolvedValue({ affected: 0 });
      expect(orderService.deleteOrder('some id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
