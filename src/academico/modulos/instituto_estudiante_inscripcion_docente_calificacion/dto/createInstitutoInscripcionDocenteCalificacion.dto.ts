import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class InstitutoInscripcionDocenteCalificacion {

  @IsNotEmpty({ message: "Debe ingresar al aula y docente" })
  @IsNumber()
  aula_docente_id: number;

  @IsNotEmpty({ message: "Debe ingresar el estudiane inscrito" })
  @IsNumber()
  instituto_estudiante_inscripcion_id: number;

  @IsNotEmpty({ message: "Debe ingresar el aula" })
  @IsNumber()
  periodo_tipo_id: number;

  @IsNotEmpty({ message: "Debe ingresar la nota cuantitativa" })
  @IsNumber()
  cuantitativa: number;

  @IsOptional({ message: "Debe ingresar la nota cualitativa" })
  @IsString()
  cualitativa: string;

  @IsNotEmpty({ message: "Debe ingresar el tipo_nota" })
  @IsNumber()
  nota_tipo_id: number;

  @IsNotEmpty({ message: "Debe ingresar el tipo_nota" })
  @IsNumber()
  modalidad_evaluacion_tipo_id: number;

}

export class CreateInstitutoInscripcionDocenteCalificacionDto {

    @IsNotEmpty({ message: "Debe ingresar al aula y docente" })
    @IsNumber()
    aula_docente_id: number;

    @IsNotEmpty({ message: "Debe ingresar al aula y docente" })
    @IsNumber()
    aula_id: number;
  
    @IsNotEmpty({ message: "Debe ingresar el estudiane inscrito" })
    @IsNumber()
    instituto_estudiante_inscripcion_id: number;
  
    @IsNotEmpty({ message: "Debe ingresar el aula" })
    @IsNumber()
    periodo_tipo_id: number;
  
    @IsNotEmpty({ message: "Debe ingresar la nota cuantitativa" })
    @IsNumber()
    cuantitativa: number;
  
    @IsOptional({ message: "Debe ingresar la nota cualitativa" })
    @IsString()
    cualitativa: string;
  
    @IsNotEmpty({ message: "Debe ingresar el tipo_nota" })
    @IsNumber()
    nota_tipo_id: number;
  
    @IsNotEmpty({ message: "Debe ingresar el tipo_nota" })
    @IsNumber()
    modalidad_evaluacion_tipo_id: number;
    
   
    @ValidateNested({ each: true })
    @Type(() => InstitutoInscripcionDocenteCalificacion)
    items: InstitutoInscripcionDocenteCalificacion[];
}

export class NewInstitutoInscripcionDocenteCalificacionDto {
    @IsNotEmpty({ message: "Debe ingresar al aula y docente" })
    @IsNumber()
    aulaDocenteId: number;
  
    @IsNotEmpty({ message: "Debe ingresar el estudiane inscrito" })
    @IsNumber()
    institutoEstudianteInscripcionId: number;
  
    @IsNotEmpty({ message: "Debe ingresar el aula" })
    @IsNumber()
    periodoTipoId: number;

    @IsNotEmpty({ message: "Debe ingresar el aula" })
    @IsNumber()
    valoracionTipoId: number;
  
  
    @IsNotEmpty({ message: "Debe ingresar la nota cuantitativa" })
    @IsNumber()
    cuantitativa: number;
  
    @IsOptional({ message: "Debe ingresar la nota cualitativa" })
    @IsString()
    cualitativa: string;
  
    @IsNotEmpty({ message: "Debe ingresar el tipo_nota" })
    @IsNumber()
    notaTipoId: number;
  
    @IsNotEmpty({ message: "Debe ingresar el Modalidad Tipo" })
    @IsNumber()
    modalidadEvaluacionTipoId: number;

    @IsNotEmpty({ message: "Debe ingresar el userId" })
    @IsNumber()
    usuarioId: number;
}