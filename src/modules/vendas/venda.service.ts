import { Injectable } from '@nestjs/common';
import { VendaRepository } from './venda.repository';
import { CreateVendaDto } from './dto/create-venda.dto';
import { Venda } from './entities/venda.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ClienteService } from '../clientes/cliente.service';
import { ProdutoService } from '../produtos/produto.service';
import { PrecoService } from '../precos/preco.service';

@Injectable()
export class VendaService {
  constructor(
    private readonly vendaRepository: VendaRepository,
    private readonly clienteService: ClienteService,
    private readonly produtoService: ProdutoService,
    private readonly precoService: PrecoService,
  ) {}

  async create(createVendaDto: CreateVendaDto): Promise<Venda> {
    await this.clienteService.findById(createVendaDto.clienteId);
    await this.produtoService.findById(createVendaDto.produtoId);

    if (!createVendaDto.preco) {
      const precoVigente = await this.precoService.findByClienteAndProduto(
        createVendaDto.clienteId,
        createVendaDto.produtoId,
      );
      createVendaDto.preco = Number(precoVigente.valor);
    }

    return await this.vendaRepository.create(createVendaDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<Venda[]> {
    return await this.vendaRepository.findAll(paginationDto);
  }

  async findById(id: number): Promise<Venda> {
    return await this.vendaRepository.findById(id);
  }

  async findByClienteId(clienteId: number, paginationDto: PaginationDto): Promise<Venda[]> {
    await this.clienteService.findById(clienteId);

    return await this.vendaRepository.findByClienteId(clienteId, paginationDto);
  }

  async findByClienteIdAndPeriodo(clienteId: number, dataInicio: Date, dataFim: Date): Promise<Venda[]> {
    await this.clienteService.findById(clienteId);

    return await this.vendaRepository.findByClienteIdAndPeriodo(clienteId, dataInicio, dataFim);
  }

  async remove(id: number): Promise<void> {
    await this.vendaRepository.remove(id);
  }
}
