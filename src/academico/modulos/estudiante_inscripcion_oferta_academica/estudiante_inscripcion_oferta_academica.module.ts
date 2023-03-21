import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteInscripcionOfertaAcademica } from 'src/academico/entidades/estudianteInscripcionOfertaAcademica.entity';
import { DatabaseModule } from 'src/database/database.module';
import { EstudianteInscripcionOfertaAcademicaController } from './estudiante_inscripcion_oferta_academica.controller';
import { EstudianteInscripcionOfertaAcademicaRepository } from './estudiante_inscripcion_oferta_academica.repository';
import { EstudianteInscripcionOfertaAcademicaService } from './estudiante_inscripcion_oferta_academica.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([EstudianteInscripcionOfertaAcademica])],
  controllers: [EstudianteInscripcionOfertaAcademicaController],
  providers: [EstudianteInscripcionOfertaAcademicaService, EstudianteInscripcionOfertaAcademicaRepository]
})
export class EstudianteInscripcionOfertaAcademicaModule {}
