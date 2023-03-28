import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { InstitucionEducativa } from 'src/academico/entidades/institucionEducativa.entity';
import { InstitucionEducativaController } from './institucion_educativa.controller';
import { InstitucionEducativaService } from './institucion_educativa.service';
import { RespuestaSigedService } from 'src/shared/respuesta.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([InstitucionEducativa])],
  controllers: [InstitucionEducativaController],
  providers: [InstitucionEducativaService, RespuestaSigedService]
})
export class InstitucionEducativaModule {}
