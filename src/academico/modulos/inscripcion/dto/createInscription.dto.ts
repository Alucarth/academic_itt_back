
import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInscriptionDto {
  
  @IsString()  
  observacion: string;

  @IsNotEmpty()
  @IsNumber()
  matriculaEstudianteId: number;

  @IsNotEmpty()
  @IsNumber()
  aulaId: number;

  @IsNotEmpty()
  @IsNumber()
  estadoMatriculaTipoId: number;

  @IsNotEmpty()
  @IsNumber()
  estadoMatriculaInicioTipoId: number;

  @IsNotEmpty()
  @IsNumber()
  ofertaCurricularId: number;
}