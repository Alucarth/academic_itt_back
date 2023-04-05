import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMaestroInscripcionDto {
  @IsNotEmpty({ message: "la Persona es requerido" })
  @IsNumber()
  personaId: number;

  @IsOptional({ message: "la UE Sucursal es requerida" })
  @IsNumber()
  institucionEducativaSucursalId: number;

  @IsNotEmpty({ message: "la UE Sucursal es requerida" })
  @IsNumber()
  institucionEducativaId: number;

  @IsNotEmpty({ message: "la formacion es requerida" })
  @IsNumber()
  formacionTipoId: number;

  @IsNotEmpty({ message: "el financiamiento es requerido" })
  @IsNumber()
  financiamientoTipoId: number;

  @IsNotEmpty({ message: "el cargo es requerido" })
  @IsNumber()
  cargoTipoId: number;

  @IsOptional({ message: "la especialidad es requerida" })
  @IsNumber()
  especialidadTipoId: number;

  @IsNotEmpty({ message: "la gestion es requerida" })
  @IsNumber()
  gestionTipoId: number;

  @IsOptional()
  @IsNotEmpty({ message: "normalista es requerido" })
  @IsBoolean()
  normalista: boolean;

  @IsOptional()
  vigente: number;

  @IsOptional()
  @IsString()
  formacionDescripcion: string;

  @IsOptional()
  @IsBoolean()
  braile: boolean;

  @IsOptional()
  @IsNumber()
  estudioIdiomaTipoId: number;

  @IsOptional()
  @IsString()
  asignacionFechaInicio: string;

  @IsOptional()
  @IsString()
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
