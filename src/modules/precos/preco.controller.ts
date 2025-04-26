import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PrecoService } from './preco.service';
import { CreatePrecoDto } from './dto/create-preco.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UpdatePrecoDto } from './dto/update-preco.dto';
import { UpdatePrecoProdutoDto } from './dto/update-preco-produto.dto';

@ApiTags('precos')
@Controller('precos')
export class PrecoController {
  constructor(private readonly precoService: PrecoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo preço' })
  @ApiResponse({
    status: 201,
    description: 'Preço criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({
    status: 409,
    description: 'Já existe um preço vigente para este cliente e produto na data especificada',
  })
  async create(@Body() createPrecoDto: CreatePrecoDto) {
    return await this.precoService.create(createPrecoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os preços' })
  @ApiResponse({
    status: 200,
    description: 'Lista de preços retornada com sucesso',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.precoService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter preço por ID' })
  @ApiParam({ name: 'id', description: 'ID do preço' })
  @ApiResponse({
    status: 200,
    description: 'Preço encontrado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Preço não encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.precoService.findById(id);
  }

  @Get(':clienteId/:produtoId')
  @ApiOperation({ summary: 'Obter preço vigente por cliente e produto' })
  @ApiParam({ name: 'clienteId', description: 'ID do cliente' })
  @ApiParam({ name: 'produtoId', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Preço encontrado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Preço não encontrado' })
  async findByClienteAndProduto(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Param('produtoId', ParseIntPipe) produtoId: number,
  ) {
    return await this.precoService.findByClienteAndProduto(clienteId, produtoId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar preço por ID' })
  @ApiParam({ name: 'id', description: 'ID do preço' })
  @ApiResponse({
    status: 200,
    description: 'Preço atualizado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Preço não encontrado' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePrecoDto: UpdatePrecoDto) {
    return await this.precoService.update(id, updatePrecoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover preço por ID' })
  @ApiParam({ name: 'id', description: 'ID do preço' })
  @ApiResponse({
    status: 204,
    description: 'Preço removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Preço não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.precoService.remove(id);
  }

  @Put('produto/:produtoId')
  @ApiOperation({ summary: 'Atualizar preço de um produto para todos os clientes' })
  @ApiParam({ name: 'produtoId', description: 'ID do produto' })
  @ApiResponse({
    status: 200,
    description: 'Preços atualizados com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async updatePrecoProduto(
    @Param('produtoId', ParseIntPipe) produtoId: number,
    @Body() updatePrecoProdutoDto: UpdatePrecoProdutoDto,
  ) {
    return await this.precoService.updatePrecoProduto(produtoId, updatePrecoProdutoDto);
  }
}
