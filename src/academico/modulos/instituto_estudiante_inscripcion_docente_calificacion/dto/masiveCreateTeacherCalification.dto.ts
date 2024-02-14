import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

class Note{
    
    @IsNotEmpty({ message: "Debe ingresar la nota cuantitativa" })
    @IsNumber()
    cuantitativa: number;

    @IsNotEmpty({ message: "Debe ingresar el tipo_nota" })
    @IsNumber()
    nota_tipo_id: number;

    @IsOptional({ message: "Debe ingresar la nota cualitativa" })
    @IsString()
    cualitativa: string;
}

export class MasiveCreateTeacherCalification
{
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
  
    @IsNotEmpty({ message: "Debe ingresar el tipo_nota" })
    @IsNumber()
    modalidad_evaluacion_tipo_id: number;

    @IsArray()
    notes : Note[]

}