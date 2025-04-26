import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrecoRepository } from './preco.repository';
import { CreatePrecoDto } from './dto/create-preco.dto';
import { UpdatePrecoDto } from './dto/update-preco.dto';
import { Preco } from './entities/preco.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ClienteService } from '../clientes/cliente.service';
import { ProdutoService } from '../produtos/produto.service';
import { NotificacaoService } from '../notificacoes/notificacao.service';

@Injectable()
export class PrecoService {
  constructor(
    private readonly precoRepository: PrecoRepository,
    private readonly clienteService: ClienteService,
    private readonly produtoService: ProdutoService,
    private readonly notificacaoService: NotificacaoService,
  ) {}

  async create(createPrecoDto: CreatePrecoDto): Promise<Preco> {
    const cliente = await this.clienteService.findById(createPrecoDto.clienteId);
    const produto = await this.produtoService.findById(createPrecoDto.produtoId);

    const precoExistente = await this.precoRepository.findByClienteAndProduto(
      createPrecoDto.clienteId,
      createPrecoDto.produtoId,
      createPrecoDto.dataInicio,
    );

    if (precoExistente) {
      throw new ConflictException(
        `Já existe um preço vigente para o cliente ${cliente.razaosocial} e produto ${produto.descricao} na data especificada`,
      );
    }

    return await this.precoRepository.create(createPrecoDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<Preco[]> {
    return await this.precoRepository.findAll(paginationDto);
  }

  async findById(id: number): Promise<Preco> {
    return await this.precoRepository.findById(id);
  }

  async findByClienteAndProduto(clienteId: number, produtoId: number): Promise<Preco> {
    const preco = await this.precoRepository.findByClienteAndProduto(clienteId, produtoId);

    if (!preco) {
      const cliente = await this.clienteService.findById(clienteId);
      const produto = await this.produtoService.findById(produtoId);
      throw new NotFoundException(
        `Não há preço vigente para o cliente ${cliente.razaosocial} e produto ${produto.descricao}`,
      );
    }

    return preco;
  }

  async update(id: number, updatePrecoDto: UpdatePrecoDto): Promise<Preco> {
    const precoAtual = await this.precoRepository.findById(id);

    if (updatePrecoDto.valor !== undefined && updatePrecoDto.valor < precoAtual.valor) {
      const cliente = await this.clienteService.findById(precoAtual.clienteId);
      const produto = await this.produtoService.findById(precoAtual.produtoId);

      await this.notificacaoService.notifyPrecoUpdate({
        clienteId: cliente.id,
        clienteRazaoSocial: cliente.razaosocial,
        produtoId: produto.id,
        produtoDescricao: produto.descricao,
        precoAntigo: precoAtual.valor,
        precoNovo: updatePrecoDto.valor,
        dataAtualizacao: new Date(),
      });
    }

    return await this.precoRepository.update(id, updatePrecoDto);
  }

  async remove(id: number): Promise<void> {
    await this.precoRepository.remove(id);
  }

  async findPrecosByPeriodo(clienteId: number, produtoId: number, startDate: Date, endDate: Date): Promise<Preco[]> {
    return await this.precoRepository.findPrecosByPeriodo(clienteId, produtoId, startDate, endDate);
  }
}
