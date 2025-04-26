import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CondPagtoService } from './condpagto.service';
import { CondPagtoController } from './condpagto.controller';
import { CondPagtoRepository } from './condpagto.repository';
import { CondPagto } from './entities/condpagto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CondPagto])],
  controllers: [CondPagtoController],
  providers: [CondPagtoService, CondPagtoRepository],
  exports: [CondPagtoService],
})
export class CondPagtoModule {}
