
import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMatriculaDto {
  @IsNotEmpty({ message: "observacion es requerido" })
  @IsString()
  @Transform(({ value }) => value?.trim())
  observacion: string;

  @IsNotEmpty()
  @IsNumber()
  institucionEducativaSucursalId: number;

  @IsNotEmpty()
  @IsNumber()
  personaId: number;

  @IsNotEmpty({ message: "codigoEstudiante es requerido" })
  @IsString()
  codigoEstudiante: string;

  @IsNotEmpty({ message: "docMatricula es requerido" })
  @IsString()
  docMatricula;

  @IsNotEmpty()
  @IsNumber()
  gestionTipoId: number;

  @IsNotEmpty()
  @IsNumber()
  periodoTipoId: number;

  @IsNotEmpty()
  @IsNumber()
  institutoPlanEstudioCarreraId: number;
}