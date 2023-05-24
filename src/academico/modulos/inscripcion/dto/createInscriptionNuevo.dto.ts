
import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInscriptionNuevoDto {
    
  @IsNotEmpty()
  @IsNumber()
  matriculaEstudianteId: number;

  @IsNotEmpty()
  @IsNumber()
  aulaId: number;

  @IsNotEmpty()
  @IsNumber()
  ofertaCurricularId: number;
}