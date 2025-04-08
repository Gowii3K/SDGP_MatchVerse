import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({example:4})
  @IsInt()
  courtId: number;

  @ApiProperty({example:'11:00'})
  @IsString()
  startingTime: string;

  @ApiProperty({example:'2025-01-01'})
  @IsDateString()
  date: string;
}
