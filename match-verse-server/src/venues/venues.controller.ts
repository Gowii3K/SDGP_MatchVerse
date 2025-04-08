import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { CreateVenueDto } from './dto/create-venue.dto';
import { VenuesService } from './venues.service';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RateVenueDto } from './dto/rate-venue.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';


@Controller('venues')
export class VenuesController {
  constructor(private venuesService: VenuesService) {}

  @Get()
  getAllVenues() {
    return this.venuesService.getAllVenues();
  }

  //Create A New Venue
  @Post()
  createNewVenue(@Body() payload: CreateVenueDto) {
    return this.venuesService.createNewVenue(payload);
  }
  //Update existing venue by passing in Id and update details
  @Put(':id')
  updateVenue(@Param('id') id: string, @Body() payload: UpdateVenueDto) {
    return this.venuesService.updateVenue(parseInt(id, 10), payload);
  }
  //Delete existing venue by passing in id
  @Delete(':id')
  deleteVenue(@Param('id') id: string) {
    return this.venuesService.deleteVenue(parseInt(id, 10));
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post(':id/upload-file')
  async addImageToVenue(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Request() req,
  ) {
    console.log(file);
    return this.venuesService.addImageToVenue(file, parseInt(id));
  }

  @Post('rate/:id')
  rateVenue(@Param('id') id: string, @Body() payload: RateVenueDto) {
    return this.venuesService.rateVenue(parseInt(id, 10), payload);
  }
}
