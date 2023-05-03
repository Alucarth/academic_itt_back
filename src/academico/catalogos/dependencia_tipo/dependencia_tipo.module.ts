import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DependenciaTipo } from 'src/academico/entidades/dependenciaTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { DependenciaTipoController } from './dependencia_tipo.controller';
import { DependenciaTipoService } from './dependencia_tipo.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([DependenciaTipo])],
  controllers: [DependenciaTipoController],
  providers: [
    DependenciaTipoService, 
    RespuestaSigedService]
})
export class DependenciaTipoModule {}
