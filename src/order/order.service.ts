import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(userId: number, createOrderDto: CreateOrderDto): Promise<Order> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const order = new Order();
    order.user = user; // Asigna el usuario completo

    order.items = await Promise.all(createOrderDto.items.map(async (item) => {
      const product = await this.productsRepository.findOne({ where: { product_id: item.productId } });
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = item.quantity;
      orderItem.unit_price = product.price;
      return orderItem;
    }));

    order.total_price = order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

    return this.ordersRepository.save(order);
  }

  async findAllByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'], // Carga las relaciones de items y product en items
    });
  }
}
