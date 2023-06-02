import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateOperativoCarreraAutorizadaDto {
  
  @IsNotEmpty({ message: "el evento es obligatorio" })
  @IsNumber()
  evento_tipo_id: number;

  @IsOptional()
  @IsString()
  observacion: string;

  @IsOptional()
  @IsString()
  fecha_inicio: string;

  @IsOptional()
  @IsString()
  fecha_fin: string;
 
}
