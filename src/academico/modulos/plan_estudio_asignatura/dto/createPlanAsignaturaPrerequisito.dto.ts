import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

class PlanAsignaturaPrerequisito {
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

    @IsOptional({ message: " id prerequisito es requerido" })
    @IsNumber()
    prerequisito_id: number;

    @IsOptional({ message: " id prerequisito es requerido" })
    @IsNumber()
    index: number;
  }

export class CreatePlanAsignaturaPrerequisitoDto {
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

    @IsOptional({ message: " id prerequisito es requerido" })
    @IsNumber()
    prerequisito_id: number;
    
    @ValidateNested({ each: true })
    @Type(() => PlanAsignaturaPrerequisito)
    datos: PlanAsignaturaPrerequisito[];

    @IsOptional({ message: " id prerequisito es requerido" })
    @IsNumber()
    index: number;
}
