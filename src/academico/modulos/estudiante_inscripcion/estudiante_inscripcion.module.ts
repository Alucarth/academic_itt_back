import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteInscripcion } from 'src/academico/entidades/estudianteInscripcion.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EstudianteInscripcionOfertaAcademicaRepository } from '../estudiante_inscripcion_oferta_academica/estudiante_inscripcion_oferta_academica.repository';
import { EstudianteInscripcionController } from './estudiante_inscripcion.controller';
import { EstudianteInscripcionRepository } from './estudiante_inscripcion.repository';
import { EstudianteInscripcionService } from './estudiante_inscripcion.service';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';

@Module({
  imports : [DatabaseModule, TypeOrmModule.forFeature([EstudianteInscripcion,InstitutoEstudianteInscripcion])],
  controllers: [EstudianteInscripcionController],
  providers: [
    EstudianteInscripcionService, 
    EstudianteInscripcionRepository,
    EstudianteInscripcionOfertaAcademicaRepository,
    RespuestaSigedService]
})
export class EstudianteInscripcionModule {}
