import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from 'src/academico/entidades/institutoEstudianteInscripcionDocenteCalificacion.entity';
import { MatriculaEstudiante } from 'src/academico/entidades/matriculaEstudiante.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaRepository } from '../aula/aula.repository';
import { InscripcionService } from '../inscripcion/inscripcion.service';
import { InstitutoEstudianteInscripcionDocenteCalificacionController } from './instituto_estudiante_inscripcion_docente_calificacion.controller';
import { InstitutoEstudianteInscripcionDocenteCalificacionRepository } from './instituto_estudiante_inscripcion_docente_calificacion.repository';
import { InstitutoEstudianteInscripcionDocenteCalificacionService } from './instituto_estudiante_inscripcion_docente_calificacion.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
     InstitutoEstudianteInscripcionDocenteCalificacion,
     
        ]),
    ],
  controllers: [InstitutoEstudianteInscripcionDocenteCalificacionController],
  providers: [
    InstitutoEstudianteInscripcionDocenteCalificacionService,
    InstitutoEstudianteInscripcionDocenteCalificacionRepository,
    AulaRepository,
    RespuestaSigedService,
    
    
]
})
export class InstitutoEstudianteInscripcionDocenteCalificacionModule {}
