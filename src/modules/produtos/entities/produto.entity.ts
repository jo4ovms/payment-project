import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Preco } from '../../precos/entities/preco.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  sku: string;

  @Column({ length: 255 })
  descricao: string;

  @OneToMany(() => Preco, (preco) => preco.produto)
  precos: Preco[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
