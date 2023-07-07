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