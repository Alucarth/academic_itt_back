import {  IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CreateResolucionDto } from "./createResolucion.dto";

export class CreatePlanEstudioResolucionDto extends  CreateResolucionDto {
    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    carrera_autorizada_id: number;
    
    @IsNotEmpty({ message: " denominacion es requerido" })
    @IsString()
    denominacion: string;
}
