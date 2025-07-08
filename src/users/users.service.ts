import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAdminDto } from './dto/create-user-admin.dto';
import { Role } from 'src/common/enums/role.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async findAll(): Promise<UserDocument[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      console.error('Error finding all users:', error);
      throw new InternalServerErrorException('No se pudieron obtener usuarios');
    }
  }

  async findOne(id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw new InternalServerErrorException('Error al buscar usuario');
    }
  }

  async create(dto: CreateUserDto): Promise<UserDocument> {
    try {
      const exists = await this.userModel.findOne({ email: dto.email }).exec();
      if (exists) {
        throw new ConflictException('El email ya está registrado');
      }

      const newUser = new this.userModel(dto);
      return await newUser.save();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      throw new InternalServerErrorException('No se pudo registrar el usuario');
    }
  }

  async createAdmin(dto: CreateAdminDto): Promise<UserDocument> {
    try {
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const adminUser = {
        ...dto,
        password: hashedPassword,
        role: Role.Admin,
      };
      return this.create(adminUser);
    } catch (error) {
      console.error('Error al crear admin:', error);
      throw new InternalServerErrorException('No se pudo registrar el admin');
    }
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new InternalServerErrorException('Error al buscar por email');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserDocument> {
    try {
      const user = await this.userModel.findByIdAndUpdate(id, dto, {
        new: true,
      }).exec();

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new InternalServerErrorException('No se pudo actualizar el usuario');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.userModel.findByIdAndDelete(id).exec();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('No se pudo eliminar el usuario');
    }
  }

  async countUsers(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
