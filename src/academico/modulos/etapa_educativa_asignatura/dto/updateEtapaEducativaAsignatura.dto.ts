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

export class UpdateEtapaEducativaAsignaturaDto {
  @IsNotEmpty({ message: "el id es requerido" })
  @IsNumber()
  @IsPositive()
  @IsNotIn([0])
  id: number;

  @IsNotEmpty({ message: "la etapaEducativaId es requerido" })
  @IsNumber()
  etapaEducativaId: number;

  @IsNotEmpty({ message: "la asignaturaTipoId es requerida" })
  @IsNumber()
  asignaturaTipoId: number;

  @IsNotEmpty({ message: "la cargaHoraria es requerida" })
  @IsNumber()
  @IsPositive()
  @IsNotIn([0])
  cargaHoraria: number;

  @IsNotEmpty({ message: "el intervaloTiempoTipoId es requerido" })
  @IsNumber()
  intervaloTiempoTipoId: number;

  @IsBoolean()
  @IsNotEmpty({ message: "el atributo opcional es requerida" })
  opcional: boolean;

  @IsNotEmpty({ message: "el atributo comentario es requerido" })
  comentario: string;

  @IsNotEmpty({ message: "el planEstudioTipoId es requerido" })
  @IsNumber()
  planEstudioTipoId: number;

  @IsNotEmpty({ message: "especialidadTipoId es requerido" })
  @IsNumber()
  especialidadTipoId: number;

  @IsNotEmpty({ message: "campoSaberTipoId es requerido" })
  @IsNumber()
  campoSaberTipoId: number;
}
