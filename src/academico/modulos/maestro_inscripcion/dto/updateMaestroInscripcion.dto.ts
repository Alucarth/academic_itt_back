import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class UpdateMaestroInscripcionDto {
  @IsNotEmpty({ message: "Identificador es requerido" })
  @IsNumber()
  id: number;

  @IsNotEmpty({ message: "la Persona es requerido" })
  @IsNumber()
  personaId: number;

  @IsNotEmpty({ message: "la UE Sucursal es requerida" })
  @IsNumber()
  institucionEducativaSucursalId: number;

  @IsNotEmpty({ message: "la formacion es requerida" })
  @IsNumber()
  formacionTipoId: number;

  @IsNotEmpty({ message: "el financiamiento es requerido" })
  @IsNumber()
  financiamientoTipoId: number;

  @IsNotEmpty({ message: "el cargo es requerido" })
  @IsNumber()
  cargoTipoId: number;

  @IsNotEmpty({ message: "la especialidad es requerida" })
  @IsNumber()
  especialidadTipoId: number;

  @IsNotEmpty({ message: "la gestion es requerida" })
  @IsNumber()
  gestionTipoId: number;

  @IsNotEmpty({ message: "normalista es requerido" })
  @IsBoolean()
  normalista: boolean;

  @IsOptional()
  @IsNotEmpty({ message: "vigente es requerido" })
  @IsBoolean()
  vigente: boolean;

  formacionDescripcion: string;

  @IsOptional()
  @IsBoolean()
  braile: boolean;

  @IsNumber()
  estudioIdiomaTipoId: number;

  @IsOptional()
  @IsDateString()
  asignacionFechaInicio: string;

  @IsOptional()
  @IsDateString()
  asignacionFechaFin: string;

  @IsOptional()
  item: string;

  @IsOptional()
  @IsNumber()
  maestroInscripcionIdAm: number;

  @IsOptional()
  @IsNumber()
  periodoTipoId: number;
}
