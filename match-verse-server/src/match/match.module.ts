import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MatchController],
  providers: [MatchService, PrismaService],
  exports:[MatchService]
})
export class MatchModule { }
