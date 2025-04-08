import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class UserBookingDto {
  @ApiProperty()
  @IsInt()
  userId:number;

  @ApiProperty()
  @IsInt()
  courtId: number;

  @ApiProperty()
  @IsString()
  startingTime: string;

  @ApiProperty()
  @IsDateString()
  date: string;
}
