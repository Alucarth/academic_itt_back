import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEstudianteInscripcionDto {

  @IsNotEmpty({ message: "la Persona es requerido" })
  @IsNumber()
  personaId: number;

  @IsNotEmpty({ message: "el Curso  es requerido" })
  @IsNumber()
  institucionEducativaCursoId: number;

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

}
