import { Controller, Get, Param, ParseIntPipe, UseFilters, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { NotificacaoService } from './notificacao.service';
import { Notificacao } from './entities/notificacao.entity';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';

@ApiTags('notificacoes')
@Controller('notificacoes')
@UseFilters(HttpExceptionFilter)
@ApiSecurity('bearer')
export class NotificacaoController {
  private readonly logger = new Logger(NotificacaoController.name);

  constructor(private readonly notificacaoService: NotificacaoService) {}

  /**
   * Retorna todas as notificações de um cliente específico
   * @param clienteId ID do cliente
   * @returns Lista de notificações do cliente
   */
  @Get('cliente/:clienteId')
  @ApiOperation({
    summary: 'Listar notificações por cliente',
    description: 'Retorna todas as notificações cadastradas para um cliente específico',
  })
  @ApiParam({
    name: 'clienteId',
    description: 'ID do cliente',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações retornada com sucesso',
    type: [Notificacao],
  })
  @ApiResponse({
    status: 404,
    description: 'Cliente não encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor',
  })
  async findByClienteId(@Param('clienteId', ParseIntPipe) clienteId: number): Promise<Notificacao[]> {
    try {
      this.logger.log(`Buscando notificações para o cliente ID: ${clienteId}`);

      const notificacoes = await this.notificacaoService.getNotificacoesByCliente(clienteId);

      if (!notificacoes || notificacoes.length === 0) {
        this.logger.debug(`Nenhuma notificação encontrada para o cliente ID: ${clienteId}`);
      } else {
        this.logger.debug(`Encontradas ${notificacoes.length} notificações para o cliente ID: ${clienteId}`);
      }

      return notificacoes;
    } catch (error) {
      this.logger.error(`Erro ao buscar notificações do cliente ${clienteId}`, error.stack);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'NOTIFICATION_FETCH_ERROR',
          message: `Erro ao buscar notificações do cliente: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
