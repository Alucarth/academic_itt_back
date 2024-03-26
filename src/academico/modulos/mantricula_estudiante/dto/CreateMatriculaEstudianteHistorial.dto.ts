import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMatriculaEstudianteHistorial
{
    @IsNotEmpty()
    @IsString()
    observacion: string
    
    @IsNotEmpty()
    @IsNumber()
    matriculaEstudianteId: number

    @IsNotEmpty()
    @IsNumber()
    estadoInstitutoId: number

    @IsOptional()
    @IsNumber()
    usuarioId: number

}