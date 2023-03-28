import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';
import { MaestroInscripcionController } from './maestro_inscripcion.controller';
import { MaestroInscripcionService } from './maestro_inscripcion.service';
import { RespuestaSigedService } from '../../../shared/respuesta.service'

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([MaestroInscripcion])],
  controllers: [MaestroInscripcionController],
  providers: [MaestroInscripcionService, RespuestaSigedService],
  exports: [MaestroInscripcionService]
})
export class MaestroInscripcionModule {}
