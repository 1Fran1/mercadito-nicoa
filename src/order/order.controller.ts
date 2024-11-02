import { Controller, Post, Get, Body, Param} from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';


@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Param('userId') userId: number) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get(':userId')
  async findAllByUser(@Param('userId') userId: number) {
    return this.ordersService.findAllByUser(userId);
  }
}
