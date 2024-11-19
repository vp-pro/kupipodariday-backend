import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { WishesModule } from '../wishes/wishes.module';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from '../wishes/entities/wish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wish]), WishesModule],
  controllers: [UsersController],
  providers: [UsersService, WishesService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
