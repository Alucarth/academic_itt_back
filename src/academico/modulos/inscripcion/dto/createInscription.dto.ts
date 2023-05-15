
import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInscriptionDto {
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

  
}