import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class NewSucursalDto {
    @IsNotEmpty()
    @IsNumber()
    sucursalCodigo: number;

    @IsNotEmpty()
    @IsString()
    sucursalNombre: string;

    @IsOptional()
    @IsString()
    observacion: string;

    @IsOptional()
    @IsString()
    telefono1: string;

    @IsOptional()
    @IsString()
    telefono2: string;


    @IsOptional()
    @IsString()
    correo: string;

    @IsOptional()
    @IsBoolean()
    vigente: boolean;

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

    @IsNotEmpty()
    @IsNumber()
    institucionEducativaId: number;

    @IsNotEmpty()
    @IsNumber()
    estadoInstitucionEducativaTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    gestionTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    jurisdiccionGeograficaId: number;
    
}