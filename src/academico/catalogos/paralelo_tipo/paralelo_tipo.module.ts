import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParaleloTipo } from 'src/academico/entidades/paraleloTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { ParaleloTipoController } from './paralelo_tipo.controller';
import { ParaleloTipoService } from './paralelo_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([ParaleloTipo])],
  controllers: [ParaleloTipoController],
  providers: [ParaleloTipoService,
  RespuestaSigedService]
})
export class ParaleloTipoModule {}
