import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { CarreraAutorizadaResolucionController } from './carrera_autorizada_resolucion.controller';
import { CarreraAutorizadaResolucionRepository } from './carrera_autorizada_resolucion.repository';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';

@Module({
  imports: [DatabaseModule, 
    TypeOrmModule.forFeature([CarreraAutorizadaResolucion, CarreraAutorizada]),
    
  ],
  
  controllers: [CarreraAutorizadaResolucionController],
  providers: [CarreraAutorizadaResolucionService,
    CarreraAutorizadaResolucionRepository,
    CarreraAutorizadaRepository,
    RespuestaSigedService
  ]
})
export class CarreraAutorizadaResolucionModule {}
