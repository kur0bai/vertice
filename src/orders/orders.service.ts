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

  async createOrder(userId: string, dto: CreateOrderDto): Promise<OrderDocument> {
    const products = await this.productModel.find({
      _id: { $in: dto.productIds },
    });

    if (products.length === 0) {
      throw new NotFoundException('No se encontraron productos válidos');
    }

    const total = products.reduce((sum, p) => sum + p.price, 0);

    const newOrder = new this.orderModel({
      user: userId,
      products: dto.productIds,
      total,
    });

    return newOrder.save();
  }

  async findAll(): Promise<OrderDocument[]> {
    return this.orderModel
      .find()
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
