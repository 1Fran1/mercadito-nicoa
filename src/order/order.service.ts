import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { OrderResponseDto } from './dto/order-response.dto';
import { plainToClass, classToPlain } from 'class-transformer';

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
    order.user = user;
  
    // Obtener todos los `product_id`s únicos de los items en la orden
    const productIds = createOrderDto.items.map(item => item.productId);
  
    // Buscar todos los productos de la orden en una sola consulta usando `In`
    const products = await this.productsRepository.find({
      where: { product_id: In(productIds) },
      relations: ['user']
    });
  
    // Asegurarse de que todos los productos existen
    if (products.length !== productIds.length) {
      throw new NotFoundException(`One or more products not found`);
    }
  
    // Crear los items de la orden
    const items = createOrderDto.items.map((item) => {
      const product = products.find(p => p.product_id === item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);
  
      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = item.quantity;
      orderItem.unit_price = product.price;
      orderItem.user = product.user; // Asigna el usuario (emprendedor) del producto
  
      return orderItem;
    });
  
    // Asignar los items a la orden
    order.items = items;
  
    // Calcular el precio total de la orden
    order.total_price = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  
    return this.ordersRepository.save(order);
  }

  async findAllOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.find({
      relations: ['items', 'items.product', 'items.product.user', 'user'],
    });
  
    // En lugar de lanzar una excepción, devolvemos un arreglo vacío si no hay órdenes
    if (!orders.length) {
      return []; // Devuelve un arreglo vacío si no hay órdenes
    }
  
    return classToPlain(orders) as OrderResponseDto[];
  }
  
  
  async findOrdersByUserId(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.ordersRepository.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
  
    if (!orders.length) {
      throw new NotFoundException(`No orders found for user with ID ${userId}`);
    }
  
    // Convertir cada Order en un OrderResponseDto
    return orders.map(order => plainToClass(OrderResponseDto, order, { excludeExtraneousValues: true }));
  }
}
