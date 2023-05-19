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


class OfertaCurricular {
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
  }

export class CreateOfertaCurricularDto {
    aulas: any[];
    /*
    instituto_plan_estudio_carrera_id(instituto_plan_estudio_carrera_id: number) {
        throw new Error('Method not implemented.');
    }
   
    plan_estudio_asignatura_id(plan_estudio_asignatura_id: number) {
        throw new Error('Method not implemented.');
    }
    periodo_tipo_id(periodo_tipo_id: number) {
        throw new Error('Method not implemented.');
    }
    gestion_tipo_id(gestion_tipo_id: number) {
        throw new Error('Method not implemented.');
    }*/
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
    @Type(() => OfertaCurricular)
    items: OfertaCurricular[];
}
