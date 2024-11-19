import { PartialType } from '@nestjs/swagger';
import { CreateWishDto } from './create-wish.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsNumber()
  @IsOptional()
  raised: number;
  @IsNumber()
  @IsOptional()
  copied: number;
}
