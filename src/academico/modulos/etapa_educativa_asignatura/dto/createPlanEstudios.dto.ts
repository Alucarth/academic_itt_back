import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class CreatePlanEstudiosDto {
  @IsNotEmpty({ message: "documento es requerido" })
  documentoNumero: string;

  @IsNotEmpty({ message: "documento url es requerida" })
  documentoUrl: string;

  @IsBoolean()
  activo: boolean;

  @IsOptional()
  comentario: string;

  @IsNotEmpty({ message: "intervaloGestionTipoId url es requerida" })
  @IsNumber()
  intervaloGestionTipoId: number;

  @IsNotEmpty({ message: "educacionTipoId es requerida" })
  @IsNumber()
  educacionTipoId: number;

  /*
  @IsNotEmpty({ message: "especialidadTipoId es requerido" })
  @IsNumber()
  especialidadTipoId: number;
  */

  @IsNotEmpty({ message: "dicumentofecha es requerido" })  
  documentoFecha: string
}
