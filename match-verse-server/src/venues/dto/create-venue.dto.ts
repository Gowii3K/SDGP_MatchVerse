import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, Max, Min } from 'class-validator';

export class CreateVenueDto {
  @ApiProperty({example:'user@email.com'})
  @IsEmail()
  email: string;

  @ApiProperty({example:'password3434'})
  @IsString()
  password: string;

  @ApiProperty({example:'No 99 , Street, Address'})
  @IsString()
  location: string;

  @ApiProperty({example:800})
  @IsInt()
  @Min(0)
  @Max(2359)
  openingTime: number;

  @ApiProperty({example:1600})
  @Min(0)
  @Max(2359)
  closingTime: number;

  @ApiProperty({example:'VenueName'})
  @IsString()
  venueName:string
}
