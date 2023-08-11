import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Body,
  Get,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

import { AuthGuard } from '@nestjs/passport';

import { User as UserEntity } from 'src/users/entity/users.entity';
import { Users } from 'src/users/decorator/user.decorator';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
    ) {}

  @ApiOperation({
    summary: 'Login as a user',
  })

  //@UsePipes(ValidationPipe)
  //@UseGuards(LocalAuthGuard)
  @UseGuards(LocalAuthGuard)
  @Post('/login22')
  async loginDam(@Req() req: Request) {
    console.log('login:', req.body);
    return await this.authService.login(req.body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request, @Users() user: UserEntity) {

    console.log('usuarioooo:', user);
    console.log('login:', req.body);
    return await this.authService.login(user);
  }
}
