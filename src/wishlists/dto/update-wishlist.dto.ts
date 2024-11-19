import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsString, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsString()
  @Length(1, 250)
  name: string;
  @IsUrl()
  image: string;
  items: Wish[];
}
