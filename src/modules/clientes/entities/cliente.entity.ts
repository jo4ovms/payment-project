import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Preco } from '../../precos/entities/preco.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 14, unique: true })
  cnpj: string;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255 })
  razaosocial: string;

  @OneToMany(() => Preco, (preco) => preco.cliente)
  precos: Preco[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
