import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Preco } from './entities/preco.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { CreatePrecoDto } from './dto/create-preco.dto';
import { UpdatePrecoDto } from './dto/update-preco.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class PrecoRepository implements IRepository<Preco> {
  constructor(
    @InjectRepository(Preco)
    private readonly repository: Repository<Preco>,
  ) {}

  async create(createPrecoDto: CreatePrecoDto): Promise<Preco> {
    const preco = this.repository.create(createPrecoDto);
    return await this.repository.save(preco);
  }

  async findAll(paginationDto: PaginationDto): Promise<Preco[]> {
    const { limit, skip } = paginationDto;
    return await this.repository.find({
      take: limit,
      skip,
      relations: ['cliente', 'produto'],
      order: { dataInicio: 'DESC' },
    });
  }

  async findById(id: number): Promise<Preco> {
    const preco = await this.repository.findOne({
      where: { id },
      relations: ['cliente', 'produto'],
    });
    if (!preco) {
      throw new NotFoundException(`Preço com ID ${id} não encontrado`);
    }
    return preco;
  }

  async findByClienteAndProduto(clienteId: number, produtoId: number, date?: Date): Promise<Preco | null> {
    const currentDate = date || new Date();

    return await this.repository.findOne({
      where: [
        {
          clienteId,
          produtoId,
          dataInicio: LessThanOrEqual(currentDate),
          dataFim: IsNull(),
        },
        {
          clienteId,
          produtoId,
          dataInicio: LessThanOrEqual(currentDate),
          dataFim: MoreThanOrEqual(currentDate),
        },
      ],
      relations: ['cliente', 'produto'],
      order: { dataInicio: 'DESC' },
    });
  }

  async findPrecosByProdutoVigentes(produtoId: number): Promise<Preco[]> {
    const currentDate = new Date();

    const clientesComPrecos = await this.repository
      .createQueryBuilder('preco')
      .select('DISTINCT preco.clienteId', 'clienteId')
      .where('preco.produtoId = :produtoId', { produtoId })
      .getRawMany();

    const resultado: Preco[] = [];

    for (const cliente of clientesComPrecos) {
      const precoVigente = await this.repository.findOne({
        where: [
          {
            produtoId,
            clienteId: cliente.clienteId,
            dataInicio: LessThanOrEqual(currentDate),
            dataFim: IsNull(),
          },
          {
            produtoId,
            clienteId: cliente.clienteId,
            dataInicio: LessThanOrEqual(currentDate),
            dataFim: MoreThanOrEqual(currentDate),
          },
        ],
        order: { dataInicio: 'DESC' },
      });

      if (precoVigente) {
        resultado.push(precoVigente);
      }
    }

    return resultado;
  }

  async getPrecoAnterior(clienteId: number, produtoId: number, dataAtual: Date): Promise<Preco | null> {
    return await this.repository.findOne({
      where: {
        clienteId,
        produtoId,
        dataFim: LessThanOrEqual(dataAtual),
      },
      order: { dataFim: 'DESC' },
    });
  }

  async update(id: number, updatePrecoDto: UpdatePrecoDto): Promise<Preco> {
    const preco = await this.findById(id);
    const updatedPreco = Object.assign(preco, updatePrecoDto);
    return await this.repository.save(updatedPreco);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Preço com ID ${id} não encontrado`);
    }
  }

  async findPrecosByPeriodo(clienteId: number, produtoId: number, startDate: Date, endDate: Date): Promise<Preco[]> {
    return await this.repository.find({
      where: [
        {
          clienteId,
          produtoId,
          dataInicio: Between(startDate, endDate),
        },
        {
          clienteId,
          produtoId,
          dataFim: Between(startDate, endDate),
        },
        {
          clienteId,
          produtoId,
          dataInicio: LessThanOrEqual(startDate),
          dataFim: MoreThanOrEqual(endDate),
        },
      ],
      relations: ['cliente', 'produto'],
      order: { dataInicio: 'ASC' },
    });
  }
}
