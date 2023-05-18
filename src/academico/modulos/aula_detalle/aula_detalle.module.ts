import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaDetalle } from 'src/academico/entidades/aulaDetalle.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaDetalleController } from './aula_detalle.controller';
import { AulaDetalleRepository } from './aula_detalle.repository';
import { AulaDetalleService } from './aula_detalle.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
         AulaDetalle
              
        ]),
    ],
  controllers: [AulaDetalleController],
  providers: [AulaDetalleService,
    AulaDetalleRepository,
  RespuestaSigedService]
})
export class AulaDetalleModule {}
