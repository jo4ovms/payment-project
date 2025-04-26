import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacao, StatusNotificacao } from './entities/notificacao.entity';

@Injectable()
export class NotificacaoRepository {
  constructor(
    @InjectRepository(Notificacao)
    private repository: Repository<Notificacao>,
  ) {}

  async create(notificacao: Partial<Notificacao>): Promise<Notificacao> {
    const novaNotificacao = this.repository.create(notificacao);
    return await this.repository.save(novaNotificacao);
  }

  async marcarComoEnviada(id: number): Promise<Notificacao> {
    await this.repository.update(id, {
      status: StatusNotificacao.ENVIADA,
      dataEnvio: new Date(),
    });
    return await this.repository.findOne({ where: { id } });
  }

  async marcarComoFalha(id: number, erro?: string): Promise<Notificacao> {
    const notificacao = await this.repository.findOne({ where: { id } });

    await this.repository.update(id, {
      status: StatusNotificacao.FALHA,
      tentativas: notificacao.tentativas + 1,
      metadados: JSON.stringify({
        ...(typeof notificacao.metadados === 'string' ? JSON.parse(notificacao.metadados) : notificacao.metadados),
        ultimoErro: erro,
      }),
    });

    return await this.repository.findOne({ where: { id } });
  }

  async findPendentes(): Promise<Notificacao[]> {
    return await this.repository.find({
      where: { status: StatusNotificacao.PENDENTE },
      order: { createdAt: 'ASC' },
    });
  }

  async findByClienteId(clienteId: number): Promise<Notificacao[]> {
    return await this.repository.find({
      where: { clienteId },
      order: { createdAt: 'DESC' },
    });
  }
}
