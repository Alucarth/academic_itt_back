import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaGeograficaTipo } from 'src/academico/entidades/areaGeograficaTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { AreaGeograficaTipoController } from './area_geografica_tipo.controller';
import { AreaGeograficaTipoService } from './area_geografica_tipo.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([AreaGeograficaTipo])],
  controllers: [AreaGeograficaTipoController],
  providers: [AreaGeograficaTipoService]
})
export class AreaGeograficaTipoModule {}
