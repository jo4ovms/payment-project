import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Venda } from './entities/venda.entity';
import { CreateVendaDto } from './dto/create-venda.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class VendaRepository {
  constructor(
    @InjectRepository(Venda)
    private readonly repository: Repository<Venda>,
  ) {}

  async create(createVendaDto: CreateVendaDto): Promise<Venda> {
    const valorTotal = createVendaDto.preco * createVendaDto.quantidade;

    const venda = this.repository.create({
      ...createVendaDto,
      valorTotal,
    });

    return await this.repository.save(venda);
  }

  async findAll(paginationDto: PaginationDto): Promise<Venda[]> {
    const { limit, skip } = paginationDto;
    return await this.repository.find({
      take: limit,
      skip,
      relations: ['cliente', 'produto'],
      order: { dataCompra: 'DESC' },
    });
  }

  async findById(id: number): Promise<Venda> {
    const venda = await this.repository.findOne({
      where: { id },
      relations: ['cliente', 'produto'],
    });

    if (!venda) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }

    return venda;
  }

  async findByClienteId(clienteId: number, paginationDto: PaginationDto): Promise<Venda[]> {
    const { limit, skip } = paginationDto;
    return await this.repository.find({
      where: { clienteId },
      take: limit,
      skip,
      relations: ['cliente', 'produto'],
      order: { dataCompra: 'DESC' },
    });
  }

  async findByClienteIdAndPeriodo(clienteId: number, dataInicio: Date, dataFim: Date): Promise<Venda[]> {
    return await this.repository.find({
      where: {
        clienteId,
        dataCompra: Between(dataInicio, dataFim),
      },
      relations: ['cliente', 'produto'],
      order: { dataCompra: 'ASC' },
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Venda com ID ${id} não encontrada`);
    }
  }
}
