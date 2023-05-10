import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarreraTipo } from 'src/academico/entidades/carrerraTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { CarreraTipoController } from './carrera_tipo.controller';
import { CarreraTipoService } from './carrera_tipo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([CarreraTipo])],
  controllers: [CarreraTipoController],
  providers: [CarreraTipoService]
})
export class CarreraTipoModule {}
