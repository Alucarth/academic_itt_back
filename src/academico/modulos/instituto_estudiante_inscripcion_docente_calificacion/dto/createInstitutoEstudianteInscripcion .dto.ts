import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateInstitutoEstudianteInscripcion
{
    @IsNotEmpty()
    @IsNumber()
    aulaId: number;

    @IsNotEmpty()
    @IsNumber()
    ofertaCurricularId: number;

    @IsNotEmpty()
    @IsNumber()
    matriculaEstudianteId: number;

    @IsNotEmpty()
    @IsNumber()
    inscripcionTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    estadoMatriculaInicioTipoId: number

    @IsNotEmpty()
    @IsNumber()
    estadoMatriculaTipoId: number
    

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number
    

}