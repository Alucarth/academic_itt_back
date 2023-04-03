import { HttpException, HttpStatus } from "@nestjs/common";
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateEtapaEducativaDto {
  @IsNotEmpty({ message: "etapaEducativaTipoId  es requerida" })
  @IsNumber()
  etapaEducativaTipoId: number;

  @IsNotEmpty({ message: "la denominacion de la etapa es requerida" })
  etapaEducativa: string;

  @IsNotEmpty({ message: "etapaEducativaId  es requerida" })
  @IsNumber()
  etapaEducativaId: number;

  @IsNotEmpty({ message: "ordinal  es requerida" })
  @IsNumber()
  ordinal: number;

  @IsNotEmpty({ message: "educacionTipoId  es requerida" })
  @IsNumber()
  educacionTipoId: number;

  @IsNotEmpty({ message: "usuarioId  es requerio" })
  @IsNumber()
  usuarioId: number;

  /** 27 es  Area de formacion de esta carrera*/
  @IsNotEmpty({ message: "codigo27  es requerio" })
  @IsNumber()
  codigo27: number;

  /** 26 es  regimen de estudios*/
  @IsNotEmpty({ message: "codigo26  es requerio" })
  @IsNumber()
  codigo26: number;

  /** 25 es  regimen de estudios*/
  @IsNotEmpty({ message: "codigo25  es requerio" })
  @IsNumber()
  codigo25: number;

  /**
   * OJO DESPUES DE INSERTAR EL REGSITRO, SE DEBE INSERTAR 3 O 6 MAS DEPENDENDO
   * DE LA DURACION, DONDE 1499 ES EL ID DE LA CARRERA RECIEN CREADA
    1600	1° PRIMER SEMESTRE	1499	0
    1601	2° SEGUNDO SEMESTRE	1499	0
    1602	3° TERCER SEMESTRE	1499	0
    1603	4° CUARTO SEMESTRE	1499	0
    1604	5° QUINTO SEMESTRE	1499	0
    1605	6° SEXTO SEMESTRE	1499	0
   */

  /*
  @IsOptional()
  @IsNumber()
  periodoTipoId: number;
  */


}
