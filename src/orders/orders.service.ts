import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Product, ProductDocument } from 'src/products/schemas/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async createOrder(dto: CreateOrderDto, userId: string): Promise<OrderDocument> {
    const productIds = dto.products.map(p => p.product);

    const productsInDb = await this.productModel.find({ _id: { $in: productIds } });

    let total = 0;

    for (const item of dto.products) {
      const product = productsInDb.find(p => p._id.toString() === item.product);
      if (!product) throw new NotFoundException(`Producto ${item.product} no encontrado`);
      total += product.price * item.quantity;
    }

    const createdOrder = new this.orderModel({
      products: dto.products,
      user: userId,
      total,
    });

    return await createdOrder.save();
  }

  async findAll(userId: string): Promise<OrderDocument[]> {
    return this.orderModel
      .find({ user: userId })
      .populate('products')
      .populate('user', 'email name')
      .exec();
  }

  async findOne(id: string): Promise<OrderDocument> {
    const order = await this.orderModel
      .findById(id)
      .populate('products')
      .populate('user', 'email name')
      .exec();

    if (!order) throw new NotFoundException('Orden no encontrada');

    return order;
  }
}
