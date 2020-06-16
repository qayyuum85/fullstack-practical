import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
