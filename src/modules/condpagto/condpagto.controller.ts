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
  Patch,
} from '@nestjs/common';
import { CondPagtoService } from './condpagto.service';
import { CreateCondPagtoDto } from './dto/create-condpagto.dto';
import { UpdateCondPagtoDto } from './dto/update-condpagto.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('condpagto')
@Controller('condpagto')
export class CondPagtoController {
  constructor(private readonly condPagtoService: CondPagtoService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova condição de pagamento' })
  @ApiResponse({
    status: 201,
    description: 'Condição de pagamento criada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(@Body() createCondPagtoDto: CreateCondPagtoDto) {
    return await this.condPagtoService.create(createCondPagtoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as condições de pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Lista de condições de pagamento retornada com sucesso',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.condPagtoService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter condição de pagamento por ID' })
  @ApiParam({ name: 'id', description: 'ID da condição de pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Condição de pagamento encontrada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Condição de pagamento não encontrada' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.condPagtoService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar condição de pagamento por ID' })
  @ApiParam({ name: 'id', description: 'ID da condição de pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Condição de pagamento atualizada com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Condição de pagamento não encontrada' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCondPagtoDto: UpdateCondPagtoDto) {
    return await this.condPagtoService.update(id, updateCondPagtoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover condição de pagamento por ID' })
  @ApiParam({ name: 'id', description: 'ID da condição de pagamento' })
  @ApiResponse({
    status: 204,
    description: 'Condição de pagamento removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Condição de pagamento não encontrada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.condPagtoService.remove(id);
  }

  @Patch(':condPagtoId/vincular-cliente/:clienteId')
  @ApiOperation({ summary: 'Vincular cliente a uma condição de pagamento' })
  @ApiParam({ name: 'condPagtoId', description: 'ID da condição de pagamento' })
  @ApiParam({ name: 'clienteId', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente vinculado com sucesso à condição de pagamento',
  })
  @ApiResponse({ status: 404, description: 'Condição de pagamento ou cliente não encontrado' })
  async vincularCliente(
    @Param('condPagtoId', ParseIntPipe) condPagtoId: number,
    @Param('clienteId', ParseIntPipe) clienteId: number,
  ) {
    await this.condPagtoService.vincularCliente(condPagtoId, clienteId);
    return { message: 'Cliente vinculado com sucesso' };
  }

  @Patch(':condPagtoId/desvincular-cliente/:clienteId')
  @ApiOperation({ summary: 'Desvincular cliente de uma condição de pagamento' })
  @ApiParam({ name: 'condPagtoId', description: 'ID da condição de pagamento' })
  @ApiParam({ name: 'clienteId', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente desvinculado com sucesso da condição de pagamento',
  })
  @ApiResponse({ status: 404, description: 'Condição de pagamento ou cliente não encontrado' })
  async desvincularCliente(
    @Param('condPagtoId', ParseIntPipe) condPagtoId: number,
    @Param('clienteId', ParseIntPipe) clienteId: number,
  ) {
    await this.condPagtoService.desvincularCliente(condPagtoId, clienteId);
    return { message: 'Cliente desvinculado com sucesso' };
  }
}
