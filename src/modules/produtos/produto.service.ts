import { Injectable, ConflictException } from '@nestjs/common';
import { ProdutoRepository } from './produto.repository';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { Produto } from './entities/produto.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ProdutoService {
  constructor(private readonly produtoRepository: ProdutoRepository) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    try {
      return await this.produtoRepository.create(createProdutoDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('SKU já cadastrado');
      }
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<Produto[]> {
    return await this.produtoRepository.findAll(paginationDto);
  }

  async findById(id: number): Promise<Produto> {
    return await this.produtoRepository.findById(id);
  }

  async findBySku(sku: string): Promise<Produto> {
    return await this.produtoRepository.findBySku(sku);
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto): Promise<Produto> {
    try {
      return await this.produtoRepository.update(id, updateProdutoDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('SKU já cadastrado para outro produto');
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.produtoRepository.remove(id);
  }
}
