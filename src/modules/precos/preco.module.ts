import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrecoService } from './preco.service';
import { PrecoController } from './preco.controller';
import { PrecoRepository } from './preco.repository';
import { Preco } from './entities/preco.entity';
import { ClienteModule } from '../clientes/cliente.module';
import { ProdutoModule } from '../produtos/produto.module';
import { RabbitMQModule } from '../../messaging/rabbitmq.module';
import { NotificacaoModule } from '../notificacoes/notificacao.module';

@Module({
  imports: [TypeOrmModule.forFeature([Preco]), ClienteModule, ProdutoModule, RabbitMQModule, NotificacaoModule],
  controllers: [PrecoController],
  providers: [PrecoService, PrecoRepository],
  exports: [PrecoService, PrecoRepository],
})
export class PrecoModule {}
