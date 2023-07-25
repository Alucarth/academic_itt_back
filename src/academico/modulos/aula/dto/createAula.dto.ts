import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class CreateAulaDto {
    @IsNotEmpty({ message: " id oferta es requerido" })
    @IsNumber()
    oferta_curricular_id: number;

    @ValidateNested({ each: true })
    @Type(() => Aula)
    aulas: Aula[];

}
class Aula {

    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    cupo: number;

    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    paralelo_tipo_id: number;

    @ValidateNested({ each: true })
    @Type(() => Detalle)
    detalles: Detalle[];
  }

  class Detalle {
    @IsNotEmpty({ message: " el dato de identificacion es requerido" })
    @IsNumber()
    dia_tipo_id: number;

    @IsNotEmpty({ message: " la hora de inicio es requerido" })
    @IsString()
    hora_inicio: string;

    @IsNotEmpty({ message: " la hora de fin es requerido" })
    @IsString()
    hora_fin: string;

    @IsOptional({ message: " el numero de aula es opcional" })
    @IsString()
    numero_aula: string;

    @IsOptional({ message: " opcional" })
    @IsString()
    observacion: string;
  }





