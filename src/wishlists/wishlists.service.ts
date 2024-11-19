import { Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
  ) {}
  async create(
    createWishlistDto: CreateWishlistDto,
    user: User,
    items: Wish[],
  ) {
    const wishlist = await this.wishListRepository.create({
      ...createWishlistDto,
      owner: user,
      items: items,
    });
    return this.wishListRepository.save(wishlist);
  }

  findAll() {
    return this.wishListRepository.find({ relations: { owner: true } });
  }

  findOne(id: number) {
    return this.wishListRepository.findOne({
      where: { id: id },
      relations: { owner: true, items: true },
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return await this.wishListRepository.update({ id }, updateWishlistDto);
  }

  remove(id: number) {
    return this.wishListRepository.delete({ id: id });
  }
}
