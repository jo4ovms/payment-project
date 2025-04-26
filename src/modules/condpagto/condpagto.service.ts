import { Injectable } from '@nestjs/common';
import { CondPagtoRepository } from './condpagto.repository';
import { CreateCondPagtoDto } from './dto/create-condpagto.dto';
import { UpdateCondPagtoDto } from './dto/update-condpagto.dto';
import { CondPagto } from './entities/condpagto.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CondPagtoService {
  constructor(private readonly condPagtoRepository: CondPagtoRepository) {}

  async create(createCondPagtoDto: CreateCondPagtoDto): Promise<CondPagto> {
    return await this.condPagtoRepository.create(createCondPagtoDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<CondPagto[]> {
    return await this.condPagtoRepository.findAll(paginationDto);
  }

  async findById(id: number): Promise<CondPagto> {
    return await this.condPagtoRepository.findById(id);
  }

  async update(id: number, updateCondPagtoDto: UpdateCondPagtoDto): Promise<CondPagto> {
    return await this.condPagtoRepository.update(id, updateCondPagtoDto);
  }

  async remove(id: number): Promise<void> {
    await this.condPagtoRepository.remove(id);
  }

  async vincularCliente(condPagtoId: number, clienteId: number): Promise<void> {
    await this.condPagtoRepository.vincularCliente(condPagtoId, clienteId);
  }

  async desvincularCliente(condPagtoId: number, clienteId: number): Promise<void> {
    await this.condPagtoRepository.desvincularCliente(condPagtoId, clienteId);
  }
}
