import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';
import { MaestroInscripcionController } from './maestro_inscripcion.controller';
import { MaestroInscripcionService } from './maestro_inscripcion.service';
import { RespuestaSigedService } from '../../../shared/respuesta.service'
import { Persona } from "../../entidades/persona.entity";
import { InstitucionEducativaSucursal } from "../../entidades/institucionEducativaSucursal.entity";
import { FormacionTipo } from "../../entidades/formacionTipo.entity";
import { FinanciamientoTipo } from "../../entidades/financiamientoTipo.entity";
import { EspecialidadTipo } from "../../entidades/especialidadTipo.entity";
import { CargoTipo } from "../../entidades/cargoTipo.entity";
import { GestionTipo } from "../../entidades/gestionTipo.entity";
import { IdiomaTipo } from "../../entidades/idiomaTipo.entity";
import { PeriodoTipo } from "../../entidades/periodoTipo.entity";
import { InstitucionEducativaSucursalRepository } from '../institucion_educativa_sucursal/institucion_educativa_sucursal.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([MaestroInscripcion]),
    TypeOrmModule.forFeature([Persona]),
    TypeOrmModule.forFeature([InstitucionEducativaSucursal]),
    TypeOrmModule.forFeature([FormacionTipo]),
    TypeOrmModule.forFeature([FinanciamientoTipo]),
    TypeOrmModule.forFeature([EspecialidadTipo]),
    TypeOrmModule.forFeature([CargoTipo]),
    TypeOrmModule.forFeature([GestionTipo]),
    TypeOrmModule.forFeature([IdiomaTipo]),
    TypeOrmModule.forFeature([PeriodoTipo]),
  ],
  controllers: [MaestroInscripcionController],
  providers: [MaestroInscripcionService, 
    RespuestaSigedService, 
    InstitucionEducativaSucursalRepository],
  exports: [MaestroInscripcionService],
})
export class MaestroInscripcionModule {}
