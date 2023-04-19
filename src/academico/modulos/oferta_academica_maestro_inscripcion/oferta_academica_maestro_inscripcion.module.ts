import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfertaAcademicaMaestroInscripcion } from 'src/academico/entidades/ofertaAcademicaMaestroInscripcion.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { OfertaAcademicaMaestroInscripcionController } from './oferta_academica_maestro_inscripcion.controller';
import { OfertaAcademicaMaestroInscripcionService } from './oferta_academica_maestro_inscripcion.service';

@Module({
  imports:[
    DatabaseModule,
    TypeOrmModule.forFeature([OfertaAcademicaMaestroInscripcion])],
    controllers: [OfertaAcademicaMaestroInscripcionController],
    providers: [OfertaAcademicaMaestroInscripcionService, RespuestaSigedService]
})
export class OfertaAcademicaMaestroInscripcionModule {}
