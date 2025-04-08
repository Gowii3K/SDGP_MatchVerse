import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsString, Min } from 'class-validator'

export class CreateCourtDto {

    
    @ApiProperty({example:'Court Name'})
    @IsString()
    name: string

    @ApiProperty({example:1})
    @IsInt()
    @Min(1)
    venueId: number



}