import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { FindUserDto } from './dto/find-user.dto';
import { WishesService } from '../wishes/wishes.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('me')
  findByName(@Req() req) {
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const existingUser = await this.usersService.checkDuplicateUser(
      updateUserDto.email,
      updateUserDto.username,
      req.user.id,
    );
    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким email или username уже существует',
      );
    }
    return await this.usersService.update(req.user.username, updateUserDto);
  }

  @UseGuards(JwtGuard)
  @Post('find')
  async findUsers(@Body() findUserDto: FindUserDto) {
    const users = await this.usersService.findUsers(findUserDto);
    return users;
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  findWishByMe(@Req() req) {
    return this.wishesService.findByUser(req.user);
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async findWishByName(@Param('username') username: string) {
    const user = await this.usersService.findByName(username);
    return this.wishesService.findByUser(user);
  }

  @UseGuards(JwtGuard)
  @Get(':user')
  async findByNameOne(@Param('user') user: string) {
    const findUser = await this.usersService.findByName(user);
    delete findUser.password;
    return findUser;
  }
}
