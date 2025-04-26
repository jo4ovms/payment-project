import { IsNotEmpty, IsNumber, IsPositive, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePrecoDto {
  @ApiProperty({
    description: 'Valor do preço',
    example: 1299.99,
  })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @IsPositive({ message: 'Valor deve ser positivo' })
  @Type(() => Number)
  valor: number;

  @ApiProperty({
    description: 'Data de início da vigência do preço',
    example: '2025-01-01',
  })
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  dataInicio: Date;

  @ApiProperty({
    description: 'Data de fim da vigência do preço',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  dataFim?: Date;

  @ApiProperty({
    description: 'ID do cliente',
    example: 1,
  })
  @IsNotEmpty({ message: 'ID do cliente é obrigatório' })
  @IsNumber({}, { message: 'ID do cliente deve ser um número' })
  @Type(() => Number)
  clienteId: number;

  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  @IsNumber({}, { message: 'ID do produto deve ser um número' })
  @Type(() => Number)
  produtoId: number;
}
