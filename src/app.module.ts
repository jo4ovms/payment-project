import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteModule } from './modules/clientes/cliente.module';
import { ProdutoModule } from './modules/produtos/produto.module';
import { CondPagtoModule } from './modules/condpagto/condpagto.module';
import { PrecoModule } from './modules/precos/preco.module';
import { RelatorioModule } from './modules/relatorios/relatorio.module';
import { RabbitMQModule } from './messaging/rabbitmq.module';
import { join } from 'path';
import rabbitmqConfig from './config/rabbitmq.config';
import databaseConfig from './config/database.config';
import { VendaModule } from './modules/vendas/venda.module';
import { NotificacaoModule } from './modules/notificacoes/notificacao.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, rabbitmqConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'vendas_api'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: configService.get('DB_SYNC', 'true') === 'true',
        logging: configService.get('DB_LOGGING', 'false') === 'true',
      }),
    }),
    ClienteModule,
    ProdutoModule,
    CondPagtoModule,
    PrecoModule,
    RelatorioModule,
    RabbitMQModule,
    VendaModule,
    NotificacaoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
