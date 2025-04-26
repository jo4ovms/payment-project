import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Produto } from '../../produtos/entities/produto.entity';

@Entity('vendas')
export class Venda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cliente_id' })
  clienteId: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'produto_id' })
  produtoId: number;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  preco: number;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ name: 'valor_total', type: 'decimal', precision: 10, scale: 2 })
  valorTotal: number;

  @Column({ name: 'data_compra', type: 'date' })
  dataCompra: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
