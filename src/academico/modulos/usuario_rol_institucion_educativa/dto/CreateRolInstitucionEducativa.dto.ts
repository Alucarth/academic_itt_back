import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class CreateRolInstitucionEducativaDto
{
    @IsNotEmpty()
    @IsNumber()
    usuarioRolId: number;

    @IsNotEmpty()
    @IsNumber()
    institucionEducativaSucursalId: number;

    @IsNotEmpty()
    @IsNumber()
    usuarioRegistro: number;
    
    @IsNotEmpty()
    @IsBoolean()
    activo: boolean;
}