import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class VenueBookingDto {

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
