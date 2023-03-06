import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoTipo } from 'src/academico/entidades/turnoTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { TurnoTipoController } from './turno_tipo.controller';
import { TurnoTipoService } from './turno_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([TurnoTipo])],
  controllers: [TurnoTipoController],
  providers: [TurnoTipoService]
})

export class TurnoTipoModule {}
