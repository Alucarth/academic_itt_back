import { Module } from '@nestjs/common';
import { InstitutoEstudianteInscripcionDocenteCalificacionController } from './instituto_estudiante_inscripcion_docente_calificacion.controller';
import { InstitutoEstudianteInscripcionDocenteCalificacionService } from './instituto_estudiante_inscripcion_docente_calificacion.service';

@Module({
  controllers: [InstitutoEstudianteInscripcionDocenteCalificacionController],
  providers: [InstitutoEstudianteInscripcionDocenteCalificacionService]
})
export class InstitutoEstudianteInscripcionDocenteCalificacionModule {}
