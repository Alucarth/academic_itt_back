import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


class Aula {

    @IsNotEmpty({ message: " id del aula es requerido" })
    @IsNumber()
    id: number;

    @IsNotEmpty({ message: " el cupo  es requerido" })
    @IsNumber()
    cupo: number;

    @IsNotEmpty({ message: " el paralelo  es requerido" })
    @IsNumber()
    paralelo_tipo_id: number;
    
    @IsOptional({ message: " el turno_tipo_id es requerido" })
    @IsNumber()
    turno_tipo_id: number;

    @ValidateNested({ each: true })
    @Type(() => Detalle)
    detalles: Detalle[];
  }

  class Detalle {
    @IsNotEmpty({ message: " el id es requerido" })
    @IsNumber()
    id: number;

    @IsNotEmpty({ message: " el dia tipo  es requerido" })
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
  class EliminadoAulas {
    @IsOptional({ message: " el id es requerido" })
    @IsNumber()
    id: number;
  }
  class EliminadoDetalles {
    @IsOptional({ message: " el id es requerido" })
    @IsNumber()
    id: number;
  }
  export class CreateAulaDto {
    @IsNotEmpty({ message: " el dato de identificacion es requerido" })
    @IsNumber()
    instituto_plan_estudio_carrera_id: number;

    @IsNotEmpty({ message: " la gestion es requerido" })
    @IsNumber()
    gestion_tipo_id: number;

    @IsNotEmpty({ message: " el periodo es requerido" })
    @IsNumber()
    periodo_tipo_id: number;

    @IsNotEmpty({ message: " el plan de estudio asignatura" })
    @IsNumber()
    plan_estudio_asignatura_id: number;

    
    
    @ValidateNested({ each: true })
    @Type(() => Aula)
    aulas: Aula[];

    @ValidateNested({ each: true })
    @Type(() => EliminadoAulas)
    eliminado_aulas: EliminadoAulas[];

    @ValidateNested({ each: true })
    @Type(() => EliminadoDetalles)
    eliminado_detalles: EliminadoDetalles[];


    //aulas: Aula[];

}




