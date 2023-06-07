import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UpdateOperativoCarreraAutorizadaDto } from "./updateOperativoCarreraAutorizada.dto";

export class CreateOperativoCarreraAutorizadaDto extends UpdateOperativoCarreraAutorizadaDto {
  @IsNotEmpty({ message: "la carrera es obligatoria" })
  @IsNumber()
  carrera_autorizada_id: number;

  @IsNotEmpty({ message: "la gestion es obligatoria" })
  @IsNumber()
  gestion_tipo_id: number;

  @IsNotEmpty({ message: "la gestion es obligatoria" })
  @IsNumber()
  periodo_tipo_id: number;

 
}
