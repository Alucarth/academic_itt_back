import { MatriculaEstudiante } from 'src/academico/entidades/matriculaEstudiante.entity';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateMatriculaEstudianteArchivo{
    @IsOptional()
    @IsString()
    descripcion: string

    @IsNotEmpty()
    @IsNumber()
    matriculaEstudianteId: number

    @IsNotEmpty()
    @IsNumber()
    archivoTipoId: number

    @IsOptional()
    @IsNumber()
    gestionTipoId: number

    @IsNotEmpty()
    @IsString()
    urlPath: string
    

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number
}