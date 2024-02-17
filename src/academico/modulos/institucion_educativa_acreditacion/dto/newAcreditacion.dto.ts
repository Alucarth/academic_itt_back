import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class NewAcreditacionDto
{
    @IsNotEmpty()
    @IsString()
    fechaResolucion: string;

    @IsOptional()
    @IsString()
    observacion: string;

    @IsNotEmpty()
    @IsString()
    numeroResolucion: string;

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

    @IsNotEmpty()
    @IsNumber()
    institucionEducativaId: number;

    @IsNotEmpty()
    @IsNumber()
    acreditacionTipoId: number;

    @IsOptional()
    @IsNumber()
    convenioTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    dependenciaTipoId: number;
    
}