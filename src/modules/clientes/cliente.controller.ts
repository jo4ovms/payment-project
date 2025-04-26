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
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiResponse({
    status: 201,
    description: 'Cliente criado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado' })
  async create(@Body() createClienteDto: CreateClienteDto) {
    return await this.clienteService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso',
  })
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.clienteService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente encontrado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async findById(@Param('id', ParseIntPipe) id: number) {
    return await this.clienteService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Cliente atualizado com sucesso',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 400, description: 'E-mail inválido' })
  @ApiResponse({ status: 409, description: 'CNPJ já cadastrado para outro cliente' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateClienteDto: UpdateClienteDto) {
    return await this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover cliente por ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 204,
    description: 'Cliente removido com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clienteService.remove(id);
  }
}
