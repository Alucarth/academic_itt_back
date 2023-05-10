import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResolucionTipo } from 'src/academico/entidades/resolucionTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { ResolucionTipoController } from './resolucion_tipo.controller';
import { ResolucionTipoService } from './resolucion_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([ResolucionTipo])],
  controllers: [ResolucionTipoController],
  providers: [ResolucionTipoService]
})
export class ResolucionTipoModule {}
