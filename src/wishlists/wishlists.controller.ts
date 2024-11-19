import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { WishesService } from '../wishes/wishes.service';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(
    private readonly wishlistsService: WishlistsService,
    private readonly wishesService: WishesService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto, @Req() req) {
    const wishes = await Promise.all(
      req.body.itemsId.map(async (el) => await this.wishesService.findById(el)),
    );

    return this.wishlistsService.create(createWishlistDto, req.user, wishes);
  }
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.wishlistsService.update(id, updateWishlistDto, userId);
  }


  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Req() req) {
    const userId = req.user.id;
    return this.wishlistsService.remove(id, userId);
  }
}
