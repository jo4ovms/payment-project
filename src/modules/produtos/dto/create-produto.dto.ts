import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProdutoDto {
  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) do produto',
    example: 'PROD-12345',
  })
  @IsNotEmpty({ message: 'SKU é obrigatório' })
  @IsString({ message: 'SKU deve ser uma string' })
  @Length(3, 50, { message: 'SKU deve ter entre 3 e 50 caracteres' })
  sku: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Notebook Dell Inspiron 15',
  })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString({ message: 'Descrição deve ser uma string' })
  @Length(3, 255, {
    message: 'Descrição deve ter entre 3 e 255 caracteres',
  })
  descricao: string;
}
