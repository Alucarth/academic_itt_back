import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePlanEstudioResolucionDto {
    @IsNotEmpty({ message: " id carrera autorizada es requerido" })
    @IsNumber()
    carrera_autorizada_id: number;

    @IsNotEmpty({ message: " numero resolucion es requerido" })
    @IsString()
    numero_resolucion: string;

    @IsNotEmpty({ message: "fecha_resolucion es requerido" })
    @IsString()
    fecha_resolucion: string;

    @IsNotEmpty({ message: " descripcion es requerido" })
    @IsString()
    descripcion: string;

    @IsNotEmpty({ message: " denominacion es requerido" })
    @IsString()
    denominacion: string;
}
