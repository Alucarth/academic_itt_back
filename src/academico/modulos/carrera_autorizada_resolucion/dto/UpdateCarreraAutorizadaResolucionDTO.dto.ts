import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdateCarreraAutorizadaResolucionDTO {
 
    
    @IsNotEmpty()
    @IsString()
    numeroResolucion: string;

    @IsNotEmpty()
    @IsString()
    fechaResolucion: string;
    

    @IsNotEmpty()
    @IsNumber()
    resolucionTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    nivelAcademicoTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    intervaloGestionTipoId: number;


    @IsNotEmpty()
    @IsNumber()
    tiempoEstudio: number;

    @IsNotEmpty()
    @IsNumber()
    cargaHoraria: number;

    @IsOptional()
    @IsNumber()
    carreraAutorizadaId: number;

    @IsOptional()
    @IsNumber()
    usuarioId: number;

    @IsOptional()
    @IsBoolean()    
    ultimo: boolean;
    
}