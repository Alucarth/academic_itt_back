import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiempoEstudioTipo } from 'src/academico/entidades/tiempoEstudioTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TiempoEstudioTipoController } from './tiempo_estudio_tipo.controller';
import { TiempoEstudioTipoService } from './tiempo_estudio_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([TiempoEstudioTipo])],
  controllers: [TiempoEstudioTipoController],
  providers: [TiempoEstudioTipoService]
})
export class TiempoEstudioTipoModule {}
