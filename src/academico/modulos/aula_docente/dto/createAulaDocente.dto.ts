import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class AulaDocente {

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
  
  @ValidateNested({ each: true })
  @Type(() => AulaDocente)
  items: AulaDocente[];
}

export class NewAulaDocenteDto
{
    @IsNotEmpty({ message: "Debe ingresar el aula" })
    @IsNumber()
    aulaId: number;

    @IsNotEmpty({ message: "Debe ingresar al maestro" })
    @IsNumber()
    maestroInscripcionId: number;

    @IsNotEmpty({ message: "la fecha de inicio es requerido"})
    @IsString()
    asignacionFechaInicio: string;

    @IsNotEmpty({ message: "la fecha fin es requerido"})
    @IsString()
    asignacionFechaFin: string;

    @IsNotEmpty({ message: "Debe ingresar al maestro" })
    @IsNumber()
    bajaTipoId: number; //por defecto 0 normal


    @IsOptional({ message: "user not found" })
    @IsNumber()
    usuarioId: number;
}