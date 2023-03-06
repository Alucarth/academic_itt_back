import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateInstitucionEducativaCursoDto {

  @IsNotEmpty({ message: "la Gestion es requerido" })
  @IsNumber()
  gestionTipoId: number;

  @IsNotEmpty({ message: "la Etapa Educativa es requerido" })
  @IsNumber()
  etapaEducativaId: number;

  @IsNotEmpty({ message: "el Turno  es requerido" })
  @IsNumber()
  turnoTipoId: number;

  @IsNotEmpty({ message: "el Paralelo es requerido" })
  @IsNumber()
  paraleloTipoId: number;

  @IsNotEmpty()
  @IsNumber()
  institucionEducativaSucursalId: number;

  @IsNotEmpty()
  @IsNumber()
  periodoTipoId: number;

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

}
