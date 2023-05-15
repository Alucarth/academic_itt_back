

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInstitutoPlanEstudioCarreraDto {

  @IsNotEmpty({ message: "la Carrera Autorizada es requerido" })
  @IsNumber()
  carrera_autorizada_id: number;

  @IsNotEmpty({ message: "El plan de estudio es requerido" })
  @IsNumber()
  plan_estudio_carrera_id: number;

  
}
