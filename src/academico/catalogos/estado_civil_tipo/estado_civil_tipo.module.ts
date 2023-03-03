import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadoCivilTipo } from 'src/academico/entidades/estadoCivilTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { EstadoCivilTipoController } from './estado_civil_tipo.controller';
import { EstadoCivilTipoService } from './estado_civil_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([EstadoCivilTipo])],
  controllers: [EstadoCivilTipoController],
  providers: [EstadoCivilTipoService]
})
export class EstadoCivilTipoModule {}
