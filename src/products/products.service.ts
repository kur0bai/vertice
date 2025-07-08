import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) { }

  async create(dto: CreateProductDto): Promise<ProductDocument> {
    try {
      const exists = await this.productModel.findOne({ email: dto.name }).exec();
      if (exists) {
        throw new ConflictException('El producto ya está registrado');
      }

      const newProduct = new this.productModel(dto);
      return await newProduct.save();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      throw new InternalServerErrorException('No se pudo registrar el producto');
    }
  }

  async findAll(): Promise<ProductDocument[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new InternalServerErrorException('No se pudieron obtener usuarios');
    }
  }

  async findOne(id: string): Promise<ProductDocument> {
    try {
      const user = await this.productModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new InternalServerErrorException('Error al buscar usuario');
    }
  }
}
