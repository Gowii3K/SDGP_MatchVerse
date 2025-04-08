import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateMatchResultDto {

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    winner1Id: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    winner2Id: number;
}