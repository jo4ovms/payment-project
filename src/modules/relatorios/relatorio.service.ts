import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { ClienteService } from '../clientes/cliente.service';
import { Venda } from '../vendas/entities/venda.entity';

export interface RelatorioVendaItem {
  produtoId: number;
  produtoSku: string;
  produtoDescricao: string;
  preco: number;
  quantidade: number;
  dataCompra: Date;
  valorTotal: number;
}

export interface RelatorioVendaCliente {
  cliente: {
    id: number;
    cnpj: string;
    razaosocial: string;
  };
  itens: RelatorioVendaItem[];
  valorTotal: number;
}

@Injectable()
export class RelatorioService {
  constructor(
    private readonly clienteService: ClienteService,
    @InjectRepository(Venda)
    private readonly vendaRepository: Repository<Venda>,
  ) {}

  async gerarRelatorioVendas(
    cnpjOuRazaoSocial: string,
    dataInicio?: Date,
    dataFim?: Date,
  ): Promise<RelatorioVendaCliente> {
    const cliente = await this.clienteService.findByCnpjOrRazaoSocial(cnpjOuRazaoSocial);

    let vendas: Venda[];

    if (!dataInicio && !dataFim) {
      vendas = await this.vendaRepository.find({
        where: {
          clienteId: cliente.id,
        },
        relations: ['produto'],
        order: {
          dataCompra: 'ASC',
        },
      });
    } else {
      const periodoInicio = dataInicio || new Date(new Date().setFullYear(new Date().getFullYear() - 2));
      const periodoFim = dataFim || new Date();

      vendas = await this.vendaRepository.find({
        where: {
          clienteId: cliente.id,
          dataCompra: Between(periodoInicio, periodoFim),
        },
        relations: ['produto'],
        order: {
          dataCompra: 'ASC',
        },
      });
    }

    if (!vendas || vendas.length === 0) {
      throw new NotFoundException(
        `Não foram encontradas vendas para o cliente ${cliente.razaosocial} no período especificado`,
      );
    }

    const itens: RelatorioVendaItem[] = vendas.map((venda) => ({
      produtoId: venda.produto.id,
      produtoSku: venda.produto.sku,
      produtoDescricao: venda.produto.descricao,
      preco: Number(venda.preco),
      quantidade: venda.quantidade,
      dataCompra: venda.dataCompra,
      valorTotal: Number(venda.valorTotal),
    }));

    const valorTotal = itens.reduce((total, item) => total + item.valorTotal, 0);

    return {
      cliente: {
        id: cliente.id,
        cnpj: cliente.cnpj,
        razaosocial: cliente.razaosocial,
      },
      itens,
      valorTotal,
    };
  }
}
