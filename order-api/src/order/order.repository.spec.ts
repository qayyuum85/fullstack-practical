import { OrderRepository } from './order.repository';
import { TestingModule, Test } from '@nestjs/testing';

const mockOrderDto = {
    title: 'mock title',
    description: 'mock description',
    price: 20
}
describe('OrderRepository', () => {
    let orderRepository:OrderRepository;

    beforeEach(async() => {
        const module:TestingModule = await Test.createTestingModule({
            providers: [OrderRepository]
        }).compile()

        orderRepository = await module.get<OrderRepository>(OrderRepository);
    });

    describe('createOrder', () => {
        let save;

        beforeEach(() => {
            save = jest.fn()
            orderRepository.create = jest.fn().mockReturnValue({save});
        });

        it('should create an orders', async () => {
            save.mockResolvedValue(undefined);
            expect(orderRepository.createOrder(mockOrderDto)).resolves.not.toThrow();
        });
    });
});