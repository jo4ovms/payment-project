import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Venda } from './entities/venda.entity';
import { VendaController } from './venda.controller';
import { VendaService } from './venda.service';
import { VendaRepository } from './venda.repository';
import { ClienteModule } from '../clientes/cliente.module';
import { ProdutoModule } from '../produtos/produto.module';
import { PrecoModule } from '../precos/preco.module';

@Module({
  imports: [TypeOrmModule.forFeature([Venda]), ClienteModule, ProdutoModule, PrecoModule],
  controllers: [VendaController],
  providers: [VendaService, VendaRepository],
  exports: [VendaService, VendaRepository],
})
export class VendaModule {}
