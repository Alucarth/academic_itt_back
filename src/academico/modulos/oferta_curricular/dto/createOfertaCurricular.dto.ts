import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class Aula {

    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    cupo: number;

    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    paralelo_tipo_id: number;

    @ValidateNested({ each: true })
    @Type(() => Detalle)
    detalles: Aula[];
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


class OfertaCurricular {
    @IsNotEmpty({ message: " el dato de identificacion es requerido" })
    @IsNumber()
    instituto_plan_estudio_carrera_id: number;

    @IsNotEmpty({ message: " el regimen grado  es requerido" })
    @IsNumber()
    regimen_grado_tipo_id: number;

    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    asignatura_tipo_id: number;

    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    horas: number;

    @ValidateNested({ each: true })
    @Type(() => Aula)
    aulas: Aula[];
  }

export class CreateOfertaCurricularDto {
    @ValidateNested({ each: true })
    @Type(() => OfertaCurricular)
    items: OfertaCurricular[];
}
