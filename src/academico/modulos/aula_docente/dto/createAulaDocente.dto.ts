import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAulaDocenteDto {

  @IsNotEmpty({ message: "Debe ingresar el aula" })
  @IsNumber()
  aula_id: number;

  @IsNotEmpty({ message: "Debe ingresar al maestro" })
  @IsNumber()
  maestro_inscripcion_id: number;

  @IsNotEmpty({ message: "la fecha de inicio es requerido"})
  @IsString()
  fecha_inicio: string;

  @IsNotEmpty({ message: "la fecha fin es requerido"})
  @IsString()
  fecha_fin: string;

}
