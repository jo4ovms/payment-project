import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, HttpStatus, HttpCode } from '@nestjs/common';
import { VendaService } from './venda.service';
import { CreateVendaDto } from './dto/create-venda.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('vendas')
@Controller('vendas')
export class VendaController {
  constructor(private readonly vendaService: VendaService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar uma nova venda' })
  @ApiResponse({
    status: 201,
    description: 'Venda registrada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente ou produto não encontrado' })
  async create(@Body() createVendaDto: CreateVendaDto) {
    return await this.vendaService.create(createVendaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as vendas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vendas retornada com sucesso',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.vendaService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter venda por ID' })
  @ApiParam({ name: 'id', description: 'ID da venda' })
  @ApiResponse({
    status: 200,
    description: 'Venda encontrada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.vendaService.findById(id);
  }

  @Get('cliente/:clienteId')
  @ApiOperation({ summary: 'Listar vendas por cliente' })
  @ApiParam({ name: 'clienteId', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vendas retornada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByClienteId(@Param('clienteId', ParseIntPipe) clienteId: number, @Query() paginationDto: PaginationDto) {
    return await this.vendaService.findByClienteId(clienteId, paginationDto);
  }

  @Get('cliente/:clienteId/periodo')
  @ApiOperation({ summary: 'Listar vendas por cliente e período' })
  @ApiParam({ name: 'clienteId', description: 'ID do cliente' })
  @ApiQuery({
    name: 'dataInicio',
    description: 'Data de início do período',
    required: true,
    type: Date,
  })
  @ApiQuery({
    name: 'dataFim',
    description: 'Data de fim do período',
    required: true,
    type: Date,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de vendas retornada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findByClienteIdAndPeriodo(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Query('dataInicio') dataInicio: string,
    @Query('dataFim') dataFim: string,
  ) {
    const dataInicioObj = new Date(dataInicio);
    const dataFimObj = new Date(dataFim);

    return await this.vendaService.findByClienteIdAndPeriodo(clienteId, dataInicioObj, dataFimObj);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover venda por ID' })
  @ApiParam({ name: 'id', description: 'ID da venda' })
  @ApiResponse({
    status: 204,
    description: 'Venda removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Venda não encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.vendaService.remove(id);
  }
}
