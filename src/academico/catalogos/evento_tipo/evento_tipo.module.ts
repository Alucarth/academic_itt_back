import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventoTipo } from 'src/academico/entidades/eventoTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EventoTipoController } from './evento_tipo.controller';
import { EventoTipoService } from './evento_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([EventoTipo])],
  controllers: [EventoTipoController],
  providers: [EventoTipoService, RespuestaSigedService]
})
export class EventoTipoModule {}
