import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { OperativoCarreraAutorizadaController } from './operativo_carrera_autorizada.controller';
import { OperativoCarreraAutorizadaRepository } from './operativo_carrera_autorizada.repository';
import { OperativoCarreraAutorizadaService } from './operativo_carrera_autorizada.service';

@Module({
  imports:[
    DatabaseModule, TypeOrmModule.forFeature([
         OperativoCarreraAutorizada
        ]),
   ],
  controllers: [OperativoCarreraAutorizadaController],
  providers: [OperativoCarreraAutorizadaService,
    OperativoCarreraAutorizadaRepository,
  RespuestaSigedService]
})
export class OperativoCarreraAutorizadaModule {}
