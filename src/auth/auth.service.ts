import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { checkPasswordHash } from '../helpers/bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string | number>('JWT_EXPIRES_IN', '1d'),
      }),
    };
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByName(username);

    const passOk = await checkPasswordHash(password, user.password);

    if (user && passOk) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
