import { IsOptional, IsString } from "class-validator";

export class UpdateFechaOperativoCarreraAutorizadaDto {
   
    @IsOptional()
    @IsString()
    fecha_inicio: string;

    @IsOptional()
    @IsString()
    fecha_fin: string;
 
}
