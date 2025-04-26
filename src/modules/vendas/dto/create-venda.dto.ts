import { IsNotEmpty, IsNumber, IsPositive, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVendaDto {
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

  @ApiProperty({
    description: 'Preço unitário do produto',
    example: 1299.99,
  })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @IsPositive({ message: 'Preço deve ser positivo' })
  @Type(() => Number)
  preco: number;

  @ApiProperty({
    description: 'Quantidade vendida',
    example: 5,
  })
  @IsNotEmpty({ message: 'Quantidade é obrigatória' })
  @IsNumber({}, { message: 'Quantidade deve ser um número' })
  @IsPositive({ message: 'Quantidade deve ser positiva' })
  @Type(() => Number)
  quantidade: number;

  @ApiProperty({
    description: 'Data da compra',
    example: '2023-01-15',
  })
  @IsNotEmpty({ message: 'Data da compra é obrigatória' })
  @IsDateString({}, { message: 'Data da compra deve ser uma data válida' })
  dataCompra: Date;
}
