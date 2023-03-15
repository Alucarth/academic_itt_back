import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EtapaEducativaAsignaturaRepository } from '../etapa_educativa_asignatura/etapa_educativa_asignatura.repository';
import { OfertaAcademicaRepository } from '../oferta_academica/oferta_academica.repository';

import { InstitucionEducativaCursoController } from './institucion_educativa_curso.controller';
import { InstitucionEducativaCursoRepository } from './institucion_educativa_curso.repository';
import { InstitucionEducativaCursoService } from './institucion_educativa_curso.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([
          InstitucionEducativaCurso, 
          EtapaEducativaAsignatura,
          OfertaAcademica]),
        ],
  controllers: [InstitucionEducativaCursoController],
  providers: [
    InstitucionEducativaCursoService, 
    InstitucionEducativaCursoRepository, 
    EtapaEducativaAsignaturaRepository,
    OfertaAcademicaRepository,
    RespuestaSigedService
  ]
})
export class InstitucionEducativaCursoModule {}
