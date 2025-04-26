import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RabbitMQService } from 'src/messaging/rabbitmq.service';
import { NotificacaoRepository } from './notificacao.repository';
import { StatusNotificacao, TipoNotificacao } from './entities/notificacao.entity';

interface PrecoNotification {
  clienteId: number;
  clienteRazaoSocial: string;
  produtoId: number;
  produtoDescricao: string;
  precoAntigo: number;
  precoNovo: number;
  dataAtualizacao: Date;
}

@Injectable()
export class NotificacaoService implements OnModuleInit {
  private readonly logger = new Logger(NotificacaoService.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly configService: ConfigService,
    private readonly notificacaoRepository: NotificacaoRepository,
  ) {}

  async onModuleInit() {
    this.logger.log('Iniciando consumidor de notificações...');
    await this.processNotifications();
    this.logger.log('Consumidor de notificações iniciado com sucesso');
  }

  async notifyPrecoUpdate(notification: PrecoNotification): Promise<boolean> {
    try {
      const mensagem = `Atualização de preço do produto ${notification.produtoDescricao} de R$ ${notification.precoAntigo} para R$ ${notification.precoNovo}`;

      const notificacaoRegistro = await this.notificacaoRepository.create({
        tipo: TipoNotificacao.ATUALIZACAO_PRECO,
        mensagem,
        clienteId: notification.clienteId,
        produtoId: notification.produtoId,
        status: StatusNotificacao.PENDENTE,
        metadados: {
          precoAntigo: notification.precoAntigo,
          precoNovo: notification.precoNovo,
          dataAtualizacao: notification.dataAtualizacao,
        },
      });

      const exchange = this.configService.get<string>('rabbitmq.exchanges.precoNotifications');

      const result = await this.rabbitMQService.publishMessage(exchange, 'preco.update', {
        id: notificacaoRegistro.id,
        ...notification,
        dataAtualizacao: new Date(),
        tipo: TipoNotificacao.ATUALIZACAO_PRECO,
      });

      this.logger.log(`Notificação de redução de preço registrada e enviada para fila: ID ${notificacaoRegistro.id}`);

      return result;
    } catch (error) {
      this.logger.error(
        `Erro ao enviar notificação de atualização de preço: ${JSON.stringify(notification)}`,
        error.stack,
      );
      return false;
    }
  }

  async processNotifications(): Promise<void> {
    try {
      const queueName = this.configService.get<string>('rabbitmq.queues.precoUpdates');

      this.logger.log(`Iniciando consumo da fila ${queueName}`);

      await this.rabbitMQService.subscribeToQueue(queueName, async (message) => {
        this.logger.log(`Processando notificação: ${JSON.stringify(message)}`);

        try {
          await this.enviarNotificacao(message);

          if (message.id) {
            await this.notificacaoRepository.marcarComoEnviada(message.id);
            this.logger.log(`Notificação ID ${message.id} marcada como enviada com sucesso`);
          }
        } catch (error) {
          this.logger.error(`Erro ao processar notificação: ${JSON.stringify(message)}`, error.stack);

          if (message.id) {
            await this.notificacaoRepository.marcarComoFalha(message.id, error.message);
            this.logger.error(`Notificação ID ${message.id} marcada como falha`);
          }

          throw error;
        }
      });

      this.logger.log(`Consumidor da fila ${queueName} inicializado com sucesso`);
    } catch (error) {
      this.logger.error('Erro ao iniciar consumidor de notificações', error.stack);
    }
  }

  private async enviarNotificacao(notification: any): Promise<void> {
    this.logger.log(
      `[REAL] E-mail enviado para cliente ${notification.clienteRazaoSocial} sobre atualização de preço do produto ${notification.produtoDescricao} de R$ ${notification.precoAntigo} para R$ ${notification.precoNovo}`,
    );

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  async getNotificacoesByCliente(clienteId: number): Promise<any[]> {
    try {
      return await this.notificacaoRepository.findByClienteId(clienteId);
    } catch (error) {
      this.logger.error(`Erro ao buscar notificações do cliente ${clienteId}`, error.stack);
      throw error;
    }
  }

  async reprocessarNotificacoesPendentes(): Promise<void> {
    const pendentes = await this.notificacaoRepository.findPendentes();
    this.logger.log(`Reprocessando ${pendentes.length} notificações pendentes`);

    for (const notificacao of pendentes) {
      this.logger.log(`Reprocessando notificação ID ${notificacao.id}`);
    }
  }
}
