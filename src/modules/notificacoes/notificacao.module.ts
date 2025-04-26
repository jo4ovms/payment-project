import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacaoService } from './notificacao.service';
import { NotificacaoController } from './notificacao.controller';
import { Notificacao } from './entities/notificacao.entity';
import { NotificacaoRepository } from './notificacao.repository';
import { RabbitMQModule } from 'src/messaging/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacao]), RabbitMQModule],
  providers: [NotificacaoService, NotificacaoRepository],
  controllers: [NotificacaoController],
  exports: [NotificacaoService],
})
export class NotificacaoModule {}
