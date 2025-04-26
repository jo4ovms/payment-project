import { Controller, Get, Param, Query } from '@nestjs/common';
import { RelatorioService } from './relatorio.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('relatorios')
@Controller('relatorio')
export class RelatorioController {
  constructor(private readonly relatorioService: RelatorioService) {}

  @Get('vendas/:cnpjOuRazaoSocial')
  @ApiOperation({ summary: 'Gerar relatório de vendas por cliente' })
  @ApiParam({
    name: 'cnpjOuRazaoSocial',
    description: 'CNPJ ou Razão Social do cliente',
    type: String,
  })
  @ApiQuery({
    name: 'dataInicio',
    description: 'Data de início do período',
    required: false,
    type: Date,
  })
  @ApiQuery({
    name: 'dataFim',
    description: 'Data de fim do período',
    required: false,
    type: Date,
  })
  @ApiResponse({
    status: 200,
    description: 'Relatório de vendas gerado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  async gerarRelatorioVendas(
    @Param('cnpjOuRazaoSocial') cnpjOuRazaoSocial: string,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
  ) {
    const dataInicioObj = dataInicio ? new Date(dataInicio) : undefined;
    const dataFimObj = dataFim ? new Date(dataFim) : undefined;

    return await this.relatorioService.gerarRelatorioVendas(cnpjOuRazaoSocial, dataInicioObj, dataFimObj);
  }
}
