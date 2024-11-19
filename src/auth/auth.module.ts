import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { jwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { LocalGuard } from './localGuard';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string | number>('JWT_EXPIRES_IN', '1d'),
          },
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    AuthService,
    jwtStrategy,
    LocalStrategy,
    UsersService,
    ConfigService,
    LocalGuard,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
