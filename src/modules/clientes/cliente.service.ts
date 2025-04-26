import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { ClienteRepository } from './cliente.repository';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    try {
      return await this.clienteRepository.create(createClienteDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('CNPJ já cadastrado');
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Cliente[]> {
    return await this.clienteRepository.findAll(paginationDto);
  }

  async findById(id: number): Promise<Cliente> {
    return await this.clienteRepository.findById(id);
  }

  async findByCnpjOrRazaoSocial(cnpjOrRazaoSocial: string): Promise<Cliente> {
    try {
      if (/^\d+$/.test(cnpjOrRazaoSocial)) {
        return await this.clienteRepository.findByCnpj(cnpjOrRazaoSocial);
      } else {
        return await this.clienteRepository.findByRazaoSocial(cnpjOrRazaoSocial);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Cliente com CNPJ ou Razão Social '${cnpjOrRazaoSocial}' não encontrado`);
      }
      throw error;
    }
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    try {
      return await this.clienteRepository.update(id, updateClienteDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('CNPJ já cadastrado para outro cliente');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.clienteRepository.remove(id);
  }
}
