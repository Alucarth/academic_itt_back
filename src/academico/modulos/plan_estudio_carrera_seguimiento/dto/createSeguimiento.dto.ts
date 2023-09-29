import { Optional } from '@nestjs/common';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSeguimientoDto {
 
  @IsNotEmpty({ message: "Proceso  es requerido" })
  @IsNumber()
  estadoInstitutoId: number;

  @IsNotEmpty({ message: "Plan de estudio de la carrera es requerido" })
  @IsNumber()
  planEstudioCarreraId: number;

  @IsOptional({ message: " opcional" })
  @IsString()
  observacion: string;
  
}
