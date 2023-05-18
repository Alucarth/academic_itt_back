import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaTipo } from 'src/academico/entidades/diaTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { DiaTipoController } from './dia_tipo.controller';
import { DiaTipoService } from './dia_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([DiaTipo])],
  controllers: [DiaTipoController],
  providers: [DiaTipoService,
    RespuestaSigedService
  ]
})
export class DiaTipoModule {}
