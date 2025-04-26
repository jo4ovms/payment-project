import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ClienteRepository implements IRepository<Cliente> {
  constructor(
    @InjectRepository(Cliente)
    private readonly repository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    const cliente = this.repository.create(createClienteDto);
    return await this.repository.save(cliente);
  }

  async findAll(paginationDto: PaginationDto): Promise<Cliente[]> {
    const { limit, skip } = paginationDto;
    return await this.repository.find({
      take: limit,
      skip,
      order: { razaosocial: 'ASC' },
    });
  }

  async findById(id: number): Promise<Cliente> {
    const cliente = await this.repository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async findByCnpj(cnpj: string): Promise<Cliente> {
    const cliente = await this.repository.findOne({ where: { cnpj } });
    if (!cliente) {
      throw new NotFoundException(`Cliente com CNPJ ${cnpj} não encontrado`);
    }
    return cliente;
  }

  async findByRazaoSocial(razaosocial: string): Promise<Cliente> {
    const cliente = await this.repository
      .createQueryBuilder('cliente')
      .where('LOWER(cliente.razaosocial) = LOWER(:razaosocial)', {
        razaosocial,
      })
      .getOne();

    if (!cliente) {
      throw new NotFoundException(`Cliente com Razão Social ${razaosocial} não encontrado`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findById(id);
    const updatedCliente = Object.assign(cliente, updateClienteDto);
    return await this.repository.save(updatedCliente);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
  }
}
