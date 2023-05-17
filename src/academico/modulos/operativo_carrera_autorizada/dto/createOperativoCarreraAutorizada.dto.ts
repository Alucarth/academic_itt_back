import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOperativoCarreraAutorizadaDto {
  @IsNotEmpty({ message: "la carrera es obligatoria" })
  @IsNumber()
  carrera_autorizada_id: number;

  @IsNotEmpty({ message: "la gestion es obligatoria" })
  @IsNumber()
  gestion_tipo_id: number;

  @IsNotEmpty({ message: "la gestion es obligatoria" })
  @IsNumber()
  periodo_tipo_id: number;

  @IsOptional()
  activo: boolean;

  @IsOptional()
  @IsString()
  observacion: string;

  @IsOptional()
  @IsString()
  fecha_inicio: string;

  @IsOptional()
  @IsString()
  fecha_fin: string;
 
}
