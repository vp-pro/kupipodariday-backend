import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { IsNumber, IsString, IsUrl, Length } from 'class-validator';
import { User } from '../../users/entities/user.entity';

import { Offer } from '../../offers/entities/offer.entity';
import { BaseEntity } from '../../base-entity/base-entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';

@Entity()
export class Wish extends BaseEntity {
  @Column({ length: 250 })
  @Length(1, 250)
  @IsString()
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ scale: 2 })
  @IsNumber()
  price: number;

  @Column({ default: 0 })
  @IsNumber()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column()
  @Length(1, 1024)
  @IsString()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ type: 'integer', default: 0 })
  @IsNumber()
  copied: number;

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist[];
}
