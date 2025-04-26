import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly maxRetries = 5;
  private connectionPromise: Promise<void>;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      this.connectionPromise = this.connectWithRetry();
      await this.connectionPromise;
    } catch (error) {
      console.error('ERRO CAPTURADO NO onModuleInit:', error);
      this.logger.error('ERRO CAPTURADO NO onModuleInit:', error);
    }
  }

  private async connectWithRetry(retryCount = 0): Promise<void> {
    try {
      const rabbitmqUrl = this.configService.get<string>('rabbitmq.url');

      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();

      const exchangeName = this.configService.get<string>('rabbitmq.exchanges.precoNotifications');
      const queueName = this.configService.get<string>('rabbitmq.queues.precoUpdates');

      await this.channel.assertExchange(exchangeName, 'topic', { durable: true });
      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.bindQueue(queueName, exchangeName, 'preco.update');

      this.logger.log('Conexão RabbitMQ estabelecida com sucesso');

      this.connection.on('error', (err) => {
        this.logger.error('Erro na conexão ao RabbitMQ:', err);
        this.reconnect();
      });

      this.connection.on('close', () => {
        this.logger.warn('Conexão RabbitMQ fechada. Tentando reconectar...');
        this.reconnect();
      });
    } catch (error) {
      if (retryCount < this.maxRetries) {
        const retryDelay = Math.pow(2, retryCount) * 1000;
        this.logger.warn(`Falha ao conectar ao RabbitMQ. Tentando novamente em ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return this.connectWithRetry(retryCount + 1);
      } else {
        this.logger.error(`Erro ao conectar ao RabbitMQ após ${this.maxRetries} tentativas`, error);
        throw error;
      }
    }
  }

  private async reconnect() {
    this.connectionPromise = this.connectWithRetry();
    await this.connectionPromise.catch((err) => {
      this.logger.error('Falha na reconexão ao RabbitMQ', err);
    });
  }

  async onModuleDestroy() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      this.logger.log('Conexão RabbitMQ fechada com sucesso');
    } catch (error) {
      this.logger.error('Erro ao fechar conexão RabbitMQ', error);
    }
  }

  async publishMessage(exchange: string, routingKey: string, message: any): Promise<boolean> {
    try {
      if (!this.channel) {
        throw new Error('Canal RabbitMQ não está disponível');
      }

      const result = this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), {
        persistent: true,
      });

      return result;
    } catch (error) {
      this.logger.error(`Erro ao publicar mensagem: ${JSON.stringify(message)}`, error.stack);
      return false;
    }
  }

  async subscribeToQueue(queueName: string, callback: (message: any) => Promise<void>): Promise<void> {
    try {
      await this.channel.consume(queueName, async (msg) => {
        if (msg) {
          const content = JSON.parse(msg.content.toString());
          try {
            await callback(content);
            this.channel.ack(msg);
          } catch (error) {
            this.logger.error(`Erro ao processar mensagem: ${JSON.stringify(content)}`, error.stack);
            this.channel.nack(msg);
          }
        }
      });
    } catch (error) {
      this.logger.error(`Erro ao inscrever-se na fila: ${queueName}`, error.stack);
    }
  }
}
