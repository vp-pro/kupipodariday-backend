import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { IsString, IsUrl, Length } from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../base-entity/base-entity';

@Entity()
export class Wishlist extends BaseEntity {
  @Column()
  @Length(1, 250)
  @IsString()
  name: string;

  @Column({ nullable: true })
  @Length(1, 1500)
  @IsString()
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToMany(() => Wish, (wish) => wish.wishlist)
  @JoinTable()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlist)
  owner: User;
}
