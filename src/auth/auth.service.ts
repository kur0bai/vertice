import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }



  async register(userDto: CreateUserDto) {
    const { email, password, name } = userDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    try {

      const userCount = await this.usersService.countUsers();
      const hashedPassword = await bcrypt.hash(password, 10);

      const userToCreate = {
        email,
        name,
        password: hashedPassword,
        role: userCount === 0 ? Role.Admin : Role.User, // If first user in db make it admin
      };

      const newUser: UserDocument = await this.usersService.create(userToCreate);

      return {
        id: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };
    } catch (error) {
      console.error('Error interno en AuthService.register:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error al registrar el usuario',
      );
    }
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    try {
      const payload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(payload);

      return {
        message: 'Login exitoso',
        data: {
          accessToken,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      };
    } catch (error) {
      console.error('Error interno en AuthService.login:', error);
      throw new InternalServerErrorException(
        'Ocurrió un error durante el login',
      );
    }
  }
}
