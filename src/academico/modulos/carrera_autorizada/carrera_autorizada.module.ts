import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaController } from './carrera_autorizada.controller';
import { CarreraAutorizadaRepository } from './carrera_autorizada.repository';
import { CarreraAutorizadaService } from './carrera_autorizada.service';
import { PlanEstudioCarrera } from 'src/academico/entidades/planEstudioCarrera.entity';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';

@Module({
  imports: [DatabaseModule, 
    TypeOrmModule.forFeature([CarreraAutorizada,PlanEstudioCarrera, InstitutoPlanEstudioCarrera, InstitucionEducativaSucursal, CarreraAutorizadaResolucion]),
  ],
  controllers: [CarreraAutorizadaController],
  providers: [CarreraAutorizadaService,
    CarreraAutorizadaRepository,
    RespuestaSigedService
  ]
})
export class CarreraAutorizadaModule {}
