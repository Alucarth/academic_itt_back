import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodoTipo } from 'src/academico/entidades/periodoTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { PeriodoTipoController } from './periodo_tipo.controller';
import { PeriodoTipoService } from './periodo_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([PeriodoTipo])],
  controllers: [PeriodoTipoController],
  providers: [PeriodoTipoService]
})
export class PeriodoTipoModule {}
