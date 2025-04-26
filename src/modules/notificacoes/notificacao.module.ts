import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacaoService } from './notificacao.service';
import { NotificacaoController } from './notificacao.controller';
import { Notificacao } from './entities/notificacao.entity';
import { NotificacaoRepository } from './notificacao.repository';
import { RabbitMQModule } from 'src/messaging/rabbitmq.module';
import { ClienteModule } from '../clientes/cliente.module';
import { EmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacao]), RabbitMQModule],
  providers: [NotificacaoService, NotificacaoRepository, EmailService],
  controllers: [NotificacaoController],
  exports: [NotificacaoService],
})
export class NotificacaoModule {}
