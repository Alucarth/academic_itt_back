import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatePlanEstudioAsignaturaDto {
  
    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    horas: number;

    @IsOptional({ message: " id prerequisito es requerido" })
    @IsNumber()
    prerequisito_id: number;
 
}
