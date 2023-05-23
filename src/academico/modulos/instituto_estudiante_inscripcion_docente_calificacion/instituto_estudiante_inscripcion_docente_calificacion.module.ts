import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from 'src/academico/entidades/institutoEstudianteInscripcionDocenteCalificacion.entity';
import { DatabaseModule } from 'src/database/database.module';
import { InstitutoEstudianteInscripcionDocenteCalificacionController } from './instituto_estudiante_inscripcion_docente_calificacion.controller';
import { InstitutoEstudianteInscripcionDocenteCalificacionService } from './instituto_estudiante_inscripcion_docente_calificacion.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
     InstitutoEstudianteInscripcionDocenteCalificacion      
        ]),
    ],
  controllers: [InstitutoEstudianteInscripcionDocenteCalificacionController],
  providers: [InstitutoEstudianteInscripcionDocenteCalificacionService]
})
export class InstitutoEstudianteInscripcionDocenteCalificacionModule {}
