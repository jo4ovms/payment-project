import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CondPagto } from './entities/condpagto.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { CreateCondPagtoDto } from './dto/create-condpagto.dto';
import { UpdateCondPagtoDto } from './dto/update-condpagto.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CondPagtoRepository implements IRepository<CondPagto> {
  constructor(
    @InjectRepository(CondPagto)
    private readonly repository: Repository<CondPagto>,
  ) {}

  async create(createCondPagtoDto: CreateCondPagtoDto): Promise<CondPagto> {
    const condPagto = this.repository.create(createCondPagtoDto);
    return await this.repository.save(condPagto);
  }

  async findAll(paginationDto: PaginationDto): Promise<CondPagto[]> {
    const { limit, skip } = paginationDto;
    return await this.repository.find({
      take: limit,
      skip,
      order: { dias: 'ASC' },
    });
  }

  async findById(id: number): Promise<CondPagto> {
    const condPagto = await this.repository.findOne({ where: { id } });
    if (!condPagto) {
      throw new NotFoundException(`Condição de Pagamento com ID ${id} não encontrada`);
    }
    return condPagto;
  }

  async update(id: number, updateCondPagtoDto: UpdateCondPagtoDto): Promise<CondPagto> {
    const condPagto = await this.findById(id);
    const updatedCondPagto = Object.assign(condPagto, updateCondPagtoDto);
    return await this.repository.save(updatedCondPagto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Condição de Pagamento com ID ${id} não encontrada`);
    }
  }

  async vincularCliente(condPagtoId: number, clienteId: number): Promise<void> {
    await this.repository.createQueryBuilder().relation(CondPagto, 'clientes').of(condPagtoId).add(clienteId);
  }

  async desvincularCliente(condPagtoId: number, clienteId: number): Promise<void> {
    await this.repository.createQueryBuilder().relation(CondPagto, 'clientes').of(condPagtoId).remove(clienteId);
  }
}
