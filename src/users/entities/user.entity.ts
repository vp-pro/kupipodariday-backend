import { Column, Entity, OneToMany } from 'typeorm';
import { IsEmail, IsString, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { BaseEntity } from '../../base-entity/base-entity';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 30, unique: true })
  @Length(2, 30)
  @IsString()
  username: string;

  @Column({ length: 200 })
  @Length(2, 200)
  @IsString()
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlist: Wishlist[];
}
