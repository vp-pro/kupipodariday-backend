import { PartialType } from '@nestjs/swagger';
import { CreateOfferDto } from './create-offer.dto';
import { User } from '../../users/entities/user.entity';
import { IsBoolean, IsNumber } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
  user: User;
  @IsNumber()
  amount: number;
  @IsBoolean()
  hidden: boolean;
  item: Wish;
}
