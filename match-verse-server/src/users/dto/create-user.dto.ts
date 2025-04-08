import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {

  @ApiProperty({example:'user@email.com'})
  @IsEmail()
  email: string;

  @ApiProperty({example:'password3434'})
  @IsString()
  password: string;

  @ApiProperty({example:'username123'})
  @IsString()
  username: string;
}
