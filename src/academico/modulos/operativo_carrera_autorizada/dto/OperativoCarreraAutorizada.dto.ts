import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class OperativoCarreraAutorizadaDTO {
    
    @IsNotEmpty()
    @IsNumber()
    gestionTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    eventoTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    periodoTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    carreraAutorizadaId: number;

    @IsOptional()
    @IsNumber()
    modalidadEvaluacionTipoId: number;

    @IsOptional()
    @IsNumber()
    usuarioId: number;
    
    @IsOptional()
    @IsBoolean()
    activo: boolean;
    
    @IsOptional()
    @IsString()
    fechaInicio: String;

    @IsOptional()
    @IsString()
    fechaFin: String;

    @IsOptional()
    @IsString()
    observacion: string;

}