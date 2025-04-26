import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatorioService } from './relatorio.service';
import { RelatorioController } from './relatorio.controller';

import { VendaRepository } from '../vendas/venda.repository';
import { ClienteModule } from '../clientes/cliente.module';
import { ProdutoModule } from '../produtos/produto.module';
import { PrecoModule } from '../precos/preco.module';
import { Venda } from '../vendas/entities/venda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venda]), ClienteModule, ProdutoModule, PrecoModule],
  controllers: [RelatorioController],
  providers: [RelatorioService, VendaRepository],
  exports: [],
})
export class RelatorioModule {}
