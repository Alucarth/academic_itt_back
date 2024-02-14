import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateTeacherCalification {
    
    @IsNotEmpty()
    @IsNumber()
    cuantitativa: number;

    @IsNotEmpty()
    @IsNumber()
    cualitativa: string;

    @IsNotEmpty()
    @IsNumber()
    usuarioId: number;

    @IsNotEmpty()
    @IsNumber()
    aulaDocenteId: number;

    @IsNotEmpty()
    @IsNumber()
    periodoTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    valoracionTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    notaTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    modalidadEvaluacionTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    institutoEstudianteInscripcionId: number;

}