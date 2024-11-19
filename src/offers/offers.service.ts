import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';

import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offersRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User, wish: Wish) {
    const offer = await this.offersRepository.create({
      ...createOfferDto,
      user: user,
      item: wish,
    });
    if (offer.user.id === wish.owner.id) {
      throw new HttpException(
        'Нельзя вносить деньги на свои желания',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (offer.amount + offer.item.raised > offer.item.price) {
      throw new HttpException(
        'Сумма собранных средств превышает стоимость подарка',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.offersRepository.save(offer);
  }

  async findAll() {
    return await this.offersRepository.find();
  }

  async findOne(id: number) {
    return await this.offersRepository.findOneBy({ id: id });
  }
}
