import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { DatabaseModule } from 'src/database/database.module';
import { CarreraAutorizadaResolucionController } from './carrera_autorizada_resolucion.controller';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';

@Module({
  imports: [DatabaseModule, 
    TypeOrmModule.forFeature([CarreraAutorizadaResolucion]),
    
  ],
  controllers: [CarreraAutorizadaResolucionController],
  providers: [CarreraAutorizadaResolucionService]
})
export class CarreraAutorizadaResolucionModule {}
