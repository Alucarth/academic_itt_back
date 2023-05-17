import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { OfertaCurricularController } from './oferta_curricular.controller';
import { OfertaCurricularRepository } from './oferta_curricular.repository';
import { OfertaCurricularService } from './oferta_curricular.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
         OfertaCurricular
              
        ]),
    ],
  controllers: [OfertaCurricularController],
  providers: [OfertaCurricularService,
    OfertaCurricularRepository,
  RespuestaSigedService]
})
export class OfertaCurricularModule {}
