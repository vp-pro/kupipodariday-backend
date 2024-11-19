import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateOfferDto {
  user: User;
  @IsNumber()
  amount: number;
  @IsBoolean()
  hidden: boolean;
  item: Wish;
}
