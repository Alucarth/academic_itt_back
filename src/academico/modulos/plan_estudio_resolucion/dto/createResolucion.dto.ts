import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateResolucionDto {
   
    @IsNotEmpty({ message: " numero resolucion es requerido" })
    @IsString()
    numero_resolucion: string;

    @IsNotEmpty({ message: "fecha_resolucion es requerido" })
    @IsString()
    fecha_resolucion: string;

    @IsOptional()
    @IsString()
    descripcion: string;
   

}
