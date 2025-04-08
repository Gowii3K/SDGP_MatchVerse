import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional } from "class-validator";

export class CreateMatchRequestDto {


    @ApiProperty()
    @IsOptional()
    @IsInt()
    bookingId?: number;

    @ApiProperty()
    @IsEnum(['single', 'double'])
    matchType: 'single' | 'double'

    @ApiProperty()
    @IsInt()
    createdById: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    partnerId?: number;

}