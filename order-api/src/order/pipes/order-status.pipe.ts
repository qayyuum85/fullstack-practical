import { PipeTransform, BadRequestException } from "@nestjs/common";
import { OrderStatus } from '../order-status.enum';

export class OrderStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [
        OrderStatus.CONFIRMED,
        OrderStatus.CANCELLED,
    ]
    
    transform(value: any){
        value = value.toUpperCase();

        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${value} is invalid status.`)
        }

        return value;
    }

    private isStatusValid(status: any) {
        const idx = this.allowedStatuses.indexOf(status)
        return idx !== -1;
    }
}