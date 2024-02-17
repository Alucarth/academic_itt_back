import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class NewInstitution {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    institucionEducativa: string;

    @IsNotEmpty()
    @IsString()
    fechaFundacion: string;

    @IsNotEmpty()
    @IsString()
    observacion: string;

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

    @IsNotEmpty()
    @IsNumber()
    educacionTipoId: number;
    
    @IsNotEmpty()
    @IsNumber()
    estadoInstitucionEducativaTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    jurisdiccionGeograficaId: number;
    
}