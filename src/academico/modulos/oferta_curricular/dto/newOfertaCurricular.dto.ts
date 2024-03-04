import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class NewOfertaCurricularDTO {
    
    @IsNotEmpty()
    @IsNumber()
    institutoPlanEstudioCarreraId: number;

    @IsNotEmpty()
    @IsNumber()
    gestionTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    periodoTipoId: number;

    @IsOptional()
    @IsNumber()
    usuarioId: number;

    @IsNotEmpty()
    @IsNumber()
    planEstudioAsignaturaId: number;

    @IsOptional()
    @IsString()
    observacion: string;
    

    
}