import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { IRepository } from '../../common/interfaces/repository.interface';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ProdutoRepository implements IRepository<Produto> {
  constructor(
    @InjectRepository(Produto)
    private readonly repository: Repository<Produto>,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const produto = this.repository.create(createProdutoDto);
    return await this.repository.save(produto);
  }

  async findAll(paginationDto: PaginationDto): Promise<Produto[]> {
    const { limit, skip } = paginationDto;
    return await this.repository.find({
      take: limit,
      skip,
      order: { descricao: 'ASC' },
    });
  }

  async findById(id: number): Promise<Produto> {
    const produto = await this.repository.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return produto;
  }

  async findBySku(sku: string): Promise<Produto> {
    const produto = await this.repository.findOne({ where: { sku } });
    if (!produto) {
      throw new NotFoundException(`Produto com SKU ${sku} não encontrado`);
    }
    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    const produto = await this.findById(id);
    const updatedProduto = Object.assign(produto, updateProdutoDto);
    return await this.repository.save(updatedProduto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
  }
}
