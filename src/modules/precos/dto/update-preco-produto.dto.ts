import { IsNotEmpty, IsNumber, IsPositive, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdatePrecoProdutoDto {
  @ApiProperty({
    description: 'Novo valor do preço',
    example: 1299.99,
  })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @IsPositive({ message: 'Valor deve ser positivo' })
  @Type(() => Number)
  valor: number;

  @ApiProperty({
    description: 'Data de início da vigência do novo preço',
    example: '2023-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de início deve ser uma data válida' })
  dataInicio?: Date;

  @ApiProperty({
    description: 'Data de fim da vigência do preço atual',
    example: '2023-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de fim deve ser uma data válida' })
  dataFim?: Date;
}
