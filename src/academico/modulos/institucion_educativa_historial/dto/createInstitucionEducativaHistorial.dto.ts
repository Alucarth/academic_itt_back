import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateInstitucionEducativaHistorialDto {
    @IsNotEmpty()
    @IsNumber()
    institucionEducativaId: number

    @IsNotEmpty()
    @IsNumber()
    institucionEducativaSucursalId: number

    @IsOptional()
    @IsString()
    fromDenominacion: string

    @IsOptional()
    @IsString()
    toDenominacion: string


    @IsOptional()
    @IsNumber()
    fromDependenciaTipoId: number

    @IsOptional()
    @IsNumber()
    toDependenciaTipoId: number


    @IsOptional()
    @IsString()
    descripcion: string

    @IsOptional()
    @IsNumber()
    usuarioId: number

}