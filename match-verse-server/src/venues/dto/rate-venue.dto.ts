import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsString, Max, Min } from 'class-validator';

export class RateVenueDto {

  @ApiProperty()
  @IsInt()
  userId: number;

  @ApiProperty()
  @IsInt()
  rating: number;
}
