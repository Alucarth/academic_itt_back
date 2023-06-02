import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

class PlanAsignatura {
    @IsNotEmpty({ message: " el plan de la carrera autorizada es requerido" })
    @IsNumber()
    plan_estudio_carrera_id: number;

    @IsNotEmpty({ message: " el regimen grado  es requerido" })
    @IsNumber()
    regimen_grado_tipo_id: number;

    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    asignatura_tipo_id: number;

    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    horas: number;
  }

export class CreatePlanEstudioAsignaturaDto {
    
    @ValidateNested({ each: true })
    @Type(() => PlanAsignatura)
    items: PlanAsignatura[];
}
