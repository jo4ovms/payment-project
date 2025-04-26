import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cliente } from 'src/modules/clientes/entities/cliente.entity';
import { Produto } from 'src/modules/produtos/entities/produto.entity';

export enum TipoNotificacao {
  ATUALIZACAO_PRECO = 'ATUALIZACAO_PRECO',
  PRODUTO_INDISPONIVEL = 'PRODUTO_INDISPONIVEL',
  NOVA_PROMOCAO = 'NOVA_PROMOCAO',
}

export enum StatusNotificacao {
  PENDENTE = 'PENDENTE',
  ENVIADA = 'ENVIADA',
  FALHA = 'FALHA',
}

@Entity('notificacoes')
export class Notificacao {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: TipoNotificacao,
    default: TipoNotificacao.ATUALIZACAO_PRECO,
  })
  tipo: TipoNotificacao;

  @Column({ type: 'text' })
  mensagem: string;

  @Column({ name: 'cliente_id' })
  clienteId: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'produto_id', nullable: true })
  produtoId: number;

  @ManyToOne(() => Produto, { nullable: true })
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column({
    type: 'enum',
    enum: StatusNotificacao,
    default: StatusNotificacao.PENDENTE,
  })
  status: StatusNotificacao;

  @Column({ name: 'data_envio', nullable: true })
  dataEnvio: Date;

  @Column({ name: 'tentativas', default: 0 })
  tentativas: number;

  @Column({ type: 'jsonb', nullable: true })
  metadados: string | object;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
