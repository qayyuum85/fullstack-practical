import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { OrderStatus } from "./order-status.enum";

@Entity()
export class Order extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    title: string;
    
    @Column()
    description: string;

    @Column()
    price: number;

    @Column()
    status: OrderStatus;

    @Column()
    createdOn: Date;

    @Column({nullable: true})
    updatedOn: Date;
}