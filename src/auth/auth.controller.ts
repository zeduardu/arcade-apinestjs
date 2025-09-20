import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jw-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ role: string; name: string; email: string }> {
    const newUser = await this.userService.create(createUserDto);
    return { role: newUser.role, name: newUser.name, email: newUser.email };
  }

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const loginResult = await this.authService.login(
        loginDto.email,
        loginDto.password,
      );
      res.status(HttpStatus.ACCEPTED).json(loginResult);
    } catch (error) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: `Credenciais inválidas. Erro: ${error}` });
    }
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  profile(@Request() req: { user: { userId: string; email: string } }) {
    return req.user;
  }
}
