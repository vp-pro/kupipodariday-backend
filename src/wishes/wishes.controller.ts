import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() req, @Body() createWishDto: CreateWishDto) {
    return await this.wishesService.create(req.user, createWishDto);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.wishesService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req,
  ) {
    return await this.wishesService.update(id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @Req() req) {
    return await this.wishesService.deleteById(id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copy(@Req() req, @Param('id') id: number) {
    return this.wishesService.copy(id, req.user);
  }
}
