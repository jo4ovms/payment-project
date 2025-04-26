import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('condpagtos')
export class CondPagto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  descricao: string;

  @Column({ type: 'integer' })
  dias: number;

  @ManyToMany(() => Cliente)
  @JoinTable({
    name: 'cliente_condpagto',
    joinColumn: { name: 'condpagto_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'cliente_id', referencedColumnName: 'id' },
  })
  clientes: Cliente[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
