import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePersonaoDto {
  @IsNotEmpty({ message: "el Numero de Carnet es requerido" })
  @IsString()
  carnetIdentidad: string;

  @IsString()
  complemento: string;

  @IsString()
  paterno: string;
  
  @IsString()
  materno: string;

  @IsNotEmpty({ message: "el Nombre es requerido" })
  @IsString()
  nombre: string;

  @IsDateString()
  fechaNacimiento?: Date | null;
  //@IsString()
  //fechaNacimiento: String;

  @IsNotEmpty({ message: "Genero es requerido" })
  @IsNumber()
  generoTipoId: number;

  @IsNotEmpty({ message: "Estado Civil es requerido" })
  @IsNumber()
  estadoCivilTipoId: number;

  @IsOptional({ message: "Sangre tipo es requerido" })
  @IsNumber()
  sangreTipoId: number;

  @IsOptional({ message: "Idioma materno es requerido" })
  @IsNumber()
  maternoIdiomaTipoId: number;

  @IsNotEmpty({ message: "Segip  tipo es requerido" })
  @IsNumber()
  segipTipoId: number;

  @IsOptional({ message: "Lugar de expedicion es requerido" })
  @IsNumber()
  expedidoUnidadTerritorialId: number;

  @IsNotEmpty({ message: "Lugar de nacimiento es requerido" })
  @IsNumber()
  nacimientoUnidadTerritorialId: number;

  @IsOptional()
  @IsString()
  nacimientoOficialia: string;

  @IsOptional()
  @IsString()
  nacimientoLibro: string;

  @IsOptional()
  @IsString()
  nacimientoPartida: string;

  @IsOptional()
  @IsString()
  nacimientoFolio: string;

  @IsOptional()
  @IsString()
  carnetIbc: string;

  @IsOptional()
  @IsString()
  pasaporte: string;

  @IsOptional()
  @IsString()
  libretaMilitar: string;

  @IsOptional()
  @IsBoolean()
  dobleNacionalidad: boolean;

  @IsOptional()
  @IsString()
  codigoRda: string;

  @IsOptional()
  @IsString()
  nacimientoLocalidad: string;

  @IsOptional()
  @IsBoolean()
  tieneDiscapacidad: boolean;

  @IsNotEmpty()
  @IsString()
  telefono: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  ciExpedidoTipoId: number;

  @IsOptional()
  @IsNumber()
  cedulaTipoId: number;
}
