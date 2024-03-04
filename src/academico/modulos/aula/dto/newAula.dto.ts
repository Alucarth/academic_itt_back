import { IsNotEmpty, IsNumber } from "class-validator";

export class NewAulaDTO {
 
    @IsNotEmpty()
    @IsNumber()
    ofertaCurricularId: number;

    @IsNotEmpty()
    @IsNumber()
    turnoTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    paraleloTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    cupo: number;

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

   

}