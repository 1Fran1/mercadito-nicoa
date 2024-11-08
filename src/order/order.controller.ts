import { Controller, Post, Get, Body, Param, ParseIntPipe} from '@nestjs/common';
import { OrdersService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';


@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Body() body: { userId: number; items: CreateOrderDto['items'] }) {
    const { userId, items } = body;
    return this.ordersService.create(userId, { items });
  }

  // Nuevo endpoint para obtener todas las órdenes
  @Get()
  async getAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Get('user/:userId')
  async getOrdersByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.ordersService.findOrdersByUserId(userId);
  }
}
