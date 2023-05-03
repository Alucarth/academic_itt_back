import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConvenioTipo } from 'src/academico/entidades/convenioTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { ConvenioTipoController } from './convenio_tipo.controller';
import { ConvenioTipoService } from './convenio_tipo.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ConvenioTipo])],
  controllers: [ConvenioTipoController],
  providers: [
    ConvenioTipoService,
    RespuestaSigedService
]
})
export class ConvenioTipoModule {}
