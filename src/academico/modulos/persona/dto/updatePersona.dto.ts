import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdatePersonaoDto {
  
  @IsNotEmpty({ message: "ID es requerido" })
  @IsNumber()
  id: number;

  /*
  @IsNotEmpty({ message: "el Numero de Carnet es requerido" })
  @IsString()
  @Transform(({ value }) => value?.trim())
  carnetIdentidad: string;

  @IsString()
  complemento: string;

  @IsString()
  paterno: string;

  @IsNotEmpty({ message: "el Ap. Materno es requerido" })
  @IsString()
  materno: string;

  @IsNotEmpty({ message: "el Nombre es requerido" })
  @IsString()
  nombre: string;

  @IsDateString()
  fechaNacimiento?: Date | null;
  */

  @IsNotEmpty({ message: "Genero es requerido" })
  @IsNumber()
  generoTipoId: number;

  @IsNotEmpty({ message: "Estado Civil es requerido" })
  @IsNumber()
  estadoCivilTipoId: number;

  /*
  @IsNotEmpty({ message: "Sangre tipo es requerido" })
  @IsNumber()
  sangreTipoId: number;*/

  @IsNotEmpty({ message: "Idioma materno es requerido" })
  @IsNumber()
  maternoIdiomaTipoId: number;

  /*
  @IsNotEmpty({ message: "Segip  tipo es requerido" })
  @IsNumber()
  segipTipoId: number;*/

  @IsNotEmpty({ message: "Lugar de expedicion es requerido" })
  @IsNumber()
  expedidoUnidadTerritorialId: number;

  @IsNotEmpty({ message: "Lugar de nacimiento es requerido" })
  @IsNumber()
  nacimientoUnidadTerritorialId: number;

  @IsString()
  nacimientoOficialia: string;

  @IsString()
  nacimientoLibro: string;

  @IsString()
  nacimientoPartida: string;

  @IsString()
  nacimientoFolio: string;

  @IsString()
  carnetIbc: string;

  @IsString()
  pasaporte: string;

  @IsString()
  libretaMilitar: string;

  @IsBoolean()
  dobleNacionalidad: boolean;

  @IsString()
  codigoRda: string;

  @IsString()
  nacimientoLocalidad: string;

  @IsBoolean()
  tieneDiscapacidad: boolean;

  @IsString()
  telefono: string;

  @IsString()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  ciExpedidoTipoId: number;
}
