import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateInstitucionEducativaCursoDto {

  @IsNotEmpty({ message: "es requerido" })  
  @IsNumber()
  id: number;

  @IsNotEmpty({ message: "el Turno  es requerido" })
  @IsNumber()
  turnoTipoId: number;

  @IsNotEmpty({ message: "el Paralelo es requerido" })
  @IsNumber()
  paraleloTipoId: number;

  
}
