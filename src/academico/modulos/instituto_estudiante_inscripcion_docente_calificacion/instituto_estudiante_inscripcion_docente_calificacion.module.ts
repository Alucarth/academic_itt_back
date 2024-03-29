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
import { Aula } from 'src/academico/entidades/aula.entity';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { Persona } from 'src/users/entity/persona.entity';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { HomologadosGestionEstudiante } from 'src/academico/entidades/homologadosGestionEstudiante.entity';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
     InstitutoEstudianteInscripcionDocenteCalificacion,
     Aula,
     InstitutoEstudianteInscripcion,
     OperativoCarreraAutorizada,
     InstitutoEstudianteInscripcionDocenteCalificacion,
     CarreraAutorizada,
     Persona,
     OfertaCurricular,
     MaestroInscripcion,
     AulaDocente,
     HomologadosGestionEstudiante
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
