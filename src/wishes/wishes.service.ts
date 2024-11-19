import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishDto: CreateWishDto) {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: user,
    });
    return await this.wishesRepository.save(wish);
  }

  async findLast() {
    const wish = await this.wishesRepository.find({
      order: { updatedAt: 'DESC' },
      take: 40,
      relations: { owner: true, offers: true },
    });
    return wish.map((el) => {
      delete el.owner.password;
      return el;
    });
  }

  async findTop() {
    const wish = await this.wishesRepository.find({
      order: { raised: 'DESC' },
      take: 20,
      relations: { owner: true },
    });
    return wish.map((el) => {
      delete el.owner.password;
      return el;
    });
  }

  async findById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });
    if (!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    }
    delete wish.owner.password;
    wish.offers.forEach((el) => delete el.user.password);
    return wish;
  }

  async update(id: number, updateWishDto: UpdateWishDto, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    }

    if (wish.owner.id !== userId) {
      throw new HttpException(
        'Вы не можете редактировать чужие подарки',
        HttpStatus.FORBIDDEN,
      );
    }

    Object.assign(wish, updateWishDto);
    return this.wishesRepository.save(wish);
  }

  async deleteById(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    if (!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    }

    if (wish.owner.id !== userId) {
      throw new HttpException(
        'Вы не можете удалять чужие подарки',
        HttpStatus.FORBIDDEN,
      );
    }

    if (wish.offers.length > 0) {
      throw new HttpException(
        'Нельза удалить, так как есть собранные средства',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.wishesRepository.remove(wish);
  }

  async copy(idWish: number, user: User) {
    const wish = await this.wishesRepository.findOneBy({ id: idWish });
    if (!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.NOT_FOUND);
    }

    const createWishDto: CreateWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: user,
    };
    const newWish = this.wishesRepository.create(createWishDto);

    const updateWishDto: UpdateWishDto = {
      raised: wish.raised,
      copied: wish.copied + 1,
    };
    await this.wishesRepository.save(newWish);
    await this.wishesRepository.update({ id: idWish }, updateWishDto);
    return {};
  }
}
