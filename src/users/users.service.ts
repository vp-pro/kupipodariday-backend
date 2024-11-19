import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { FindUserDto } from './dto/find-user.dto';
import { createHashPassword } from '../helpers/bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.create(createUserDto);
    const pass = createUserDto.password;
    await bcrypt.hash(pass, 5).then((passHash: string) => {
      user.password = passHash;
    });
    return this.usersRepository.save(user);
  }

  async findByName(username: string) {
    return await this.usersRepository.findOne({
      where: { username: username },
    });
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
      },
    });
    const { password, ...result } = user;
    return result;
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await createHashPassword(
        updateUserDto.password,
        5,
      );
    }
    return this.usersRepository.update({ username: username }, updateUserDto);
  }

  async findUsers(findUserDto: FindUserDto) {
    const users = await this.usersRepository.find({
      where: [{ username: findUserDto.query }, { email: findUserDto.query }],
    });

    return users.map((el) => {
      const { password, ...result } = el;
      return result;
    });
  }
}
