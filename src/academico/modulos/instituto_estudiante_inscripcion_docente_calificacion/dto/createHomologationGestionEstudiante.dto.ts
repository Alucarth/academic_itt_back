import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateHomologationGestionEstudiante{
    
    @IsNotEmpty()
    @IsNumber()
    fromInstitutoPlanEstudioCarreraId: number;

    @IsNotEmpty()
    @IsNumber()
    toInstitutoPlanEstudioCarreraId: number;

    @IsNotEmpty()
    @IsNumber()
    institutoEstudianteInscripcionId: number;

    @IsNotEmpty()
    @IsNumber()
    institutoEstudianteInscripcionDocenteCalificacionId: number;

    @IsNotEmpty()
    @IsNumber()
    regimenGradoTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    toEstadoMatriculaTipoId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNotEmpty()
    @IsNumber()
    indexSort: number;
}