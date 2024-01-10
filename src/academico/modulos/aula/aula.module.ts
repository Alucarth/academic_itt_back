import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from 'src/academico/entidades/aula.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaController } from './aula.controller';
import { AulaRepository } from './aula.repository';
import { AulaService } from './aula.service';
import { OfertaCurricularService } from '../oferta_curricular/oferta_curricular.service';
import { AulaDetalle } from 'src/academico/entidades/aulaDetalle.entity';
import { AulaDetalleRepository } from '../aula_detalle/aula_detalle.repository';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { OfertaCurricularRepository } from '../oferta_curricular/oferta_curricular.repository';
import { AulaDetalleService } from '../aula_detalle/aula_detalle.service';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from 'src/academico/entidades/institutoEstudianteInscripcionDocenteCalificacion.entity';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
         Aula,
         AulaDetalle,
         OfertaCurricular,
         InstitutoEstudianteInscripcion,
         InstitutoEstudianteInscripcionDocenteCalificacion,InstitutoPlanEstudioCarrera

        ]),
    ],
  controllers: [AulaController],
  providers: [
    AulaRepository, 
    AulaService, 
    RespuestaSigedService,
    OfertaCurricularService,
    OfertaCurricularRepository,
    AulaDetalleService,
    AulaDetalleRepository,
  ]
})
export class AulaModule {}
