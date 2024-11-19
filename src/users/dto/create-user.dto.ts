import { IsEmail, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;
  @IsString()
  @Length(2, 200)
  about: string;
  @IsUrl()
  @IsString()
  avatar: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
