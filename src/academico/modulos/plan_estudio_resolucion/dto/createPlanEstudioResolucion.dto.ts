import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePlanEstudioResolucionDto {
    @IsNotEmpty({ message: " es requerido" })
    @IsNumber()
    carrera_autorizada_id: number;

    @IsNotEmpty({ message: " es requerido" })
    @IsString()
    numero_resolucion: string;

    @IsNotEmpty({ message: " es requerido" })
    @IsString()
    fecha_resolucion: string;

    @IsNotEmpty({ message: " es requerido" })
    @IsString()
    descripcion: string;
    
}
