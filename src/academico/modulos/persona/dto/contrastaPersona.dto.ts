import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ContrastaPersonaDto {
  @IsNotEmpty({ message: "el Numero de Carnet es requerido" })
  @IsString()
  carnetIdentidad: string;

  @IsString()
  complemento: string;

  @IsString()
  paterno: string;

  @IsString({ message: "el Ap. Materno es requerido" })
  @IsString()
  materno: string;

  @IsNotEmpty({ message: "el Nombre es requerido" })
  @IsString()
  nombre: string;

  @IsDateString()
  fechaNacimiento?: Date | null;
  
  @IsOptional()
  @IsNumber()
  cedulaTipoId: number;
}
