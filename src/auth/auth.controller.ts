import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation } from '@nestjs/swagger';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Crear un usuario estandar' })
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: CreateUserDto) {
    const createdUser = await this.authService.register(user);
    return {
      status: 'success',
      message: 'Usuario registrado correctamente',
      data: {
        id: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        name: createdUser.name,
      },
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicio de sesión' })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Perfil del usuario' })
  userRoute(@Request() req: RequestWithUser) {
    return {
      message: 'Perfil de usuario',
      user: req.user,
    };
  }
}
