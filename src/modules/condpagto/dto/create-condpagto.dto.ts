import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCondPagtoDto {
  @ApiProperty({
    description: 'Descrição da condição de pagamento',
    example: 'À vista',
  })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString({ message: 'Descrição deve ser uma string' })
  @Length(3, 255, {
    message: 'Descrição deve ter entre 3 e 255 caracteres',
  })
  descricao: string;

  @ApiProperty({
    description: 'Dias para pagamento',
    example: 30,
  })
  @IsNotEmpty({ message: 'Dias é obrigatório' })
  @IsNumber({}, { message: 'Dias deve ser um número' })
  @Min(0, { message: 'Dias deve ser maior ou igual a zero' })
  dias: number;
}
