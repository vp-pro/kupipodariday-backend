import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';

import { JwtGuard } from '../auth/jwt.guard';
import { WishesService } from '../wishes/wishes.service';

import { UpdateWishDto } from '../wishes/dto/update-wish.dto';

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishService: WishesService,
  ) {}
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req) {
    const wish = await this.wishService.findById(req.body.itemId);
    const updateWishDto: UpdateWishDto = {
      raised: wish.raised + createOfferDto.amount,
      copied: wish.copied,
    };
    await this.offersService.create(createOfferDto, req.user, wish);
    await this.wishService.update(wish.id, updateWishDto);
    return {};
  }
  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.offersService.findAll();
  }
  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.offersService.findOne(id);
  }
}
