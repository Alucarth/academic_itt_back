import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducacionTipo } from 'src/academico/entidades/educacionTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EducacionTipoController } from './educacion_tipo.controller';
import { EducacionTipoService } from './educacion_tipo.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([EducacionTipo])],
  controllers: [EducacionTipoController],
  providers: [
    EducacionTipoService, 
    RespuestaSigedService
  ]
})
export class EducacionTipoModule {}
