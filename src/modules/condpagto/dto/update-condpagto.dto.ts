import { PartialType } from '@nestjs/swagger';
import { CreateCondPagtoDto } from './create-condpagto.dto';

export class UpdateCondPagtoDto extends PartialType(CreateCondPagtoDto) {}
