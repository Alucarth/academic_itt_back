import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOfertaAcademicaMaestroInscripcionDto {
  @IsNotEmpty({ message: " es requerido" })
  @IsNumber()
  maestroInscripcionId: number;

  @IsNotEmpty()
  ofertaAcademica: Array<any>
}
