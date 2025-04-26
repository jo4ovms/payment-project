import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    description: 'CNPJ do cliente (apenas números)',
    example: '12345678000199',
  })
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Length(14, 14, { message: 'CNPJ deve ter 14 caracteres' })
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter apenas números' })
  cnpj: string;

  @ApiProperty({
    description: 'E-mail do cliente',
    example: '9y6o8@example.com',
  })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsString({ message: 'E-mail deve ser uma string' })
  @Length(3, 255, {
    message: 'E-mail deve ter entre 3 e 255 caracteres',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Razão Social do cliente',
    example: 'Empresa ACME Ltda.',
  })
  @IsNotEmpty({ message: 'Razão Social é obrigatória' })
  @IsString({ message: 'Razão Social deve ser uma string' })
  @Length(3, 255, {
    message: 'Razão Social deve ter entre 3 e 255 caracteres',
  })
  razaosocial: string;
}
