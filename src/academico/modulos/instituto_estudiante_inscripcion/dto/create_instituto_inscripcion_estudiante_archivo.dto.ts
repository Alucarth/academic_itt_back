import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateInstitutoInscripcionEstudianteArchivo{
    @IsNotEmpty()
    @IsString()
    descripcion: string

    @IsNotEmpty()
    @IsNumber()
    institutoEstudianteInscripcionId: number

    @IsNotEmpty()
    @IsNumber()
    archivoTipoId: number

    @IsNotEmpty()
    @IsString()
    urlPath: string

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number
}