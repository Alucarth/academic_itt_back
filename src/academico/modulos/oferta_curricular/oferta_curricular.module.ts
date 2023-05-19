import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from 'src/academico/entidades/aula.entity';
import { AulaDetalle } from 'src/academico/entidades/aulaDetalle.entity';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaRepository } from '../aula/aula.repository';
import { AulaDetalleRepository } from '../aula_detalle/aula_detalle.repository';
import { OfertaCurricularController } from './oferta_curricular.controller';
import { OfertaCurricularRepository } from './oferta_curricular.repository';
import { OfertaCurricularService } from './oferta_curricular.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
         OfertaCurricular,
         Aula,
         AulaDetalle     
        ]),
    ],
  controllers: [OfertaCurricularController],
  providers: [OfertaCurricularService,
    OfertaCurricularRepository,
    AulaRepository,
    AulaDetalleRepository,
  RespuestaSigedService]
})
export class OfertaCurricularModule {}
