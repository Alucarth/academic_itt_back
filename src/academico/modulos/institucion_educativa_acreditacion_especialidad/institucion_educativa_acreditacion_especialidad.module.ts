import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionEducativaAcreditacionEspecialidad } from 'src/academico/entidades/institucionEducativaAcreditacionEspecialidad.entity';
import { DatabaseModule } from 'src/database/database.module';
import { InstitucionEducativaAcreditacionEspecialidadController } from './institucion_educativa_acreditacion_especialidad.controller';
import { InstitucionEducativaAcreditacionEspecialidadService } from './institucion_educativa_acreditacion_especialidad.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([InstitucionEducativaAcreditacionEspecialidad])],
  controllers: [InstitucionEducativaAcreditacionEspecialidadController],
  providers: [InstitucionEducativaAcreditacionEspecialidadService]
})
export class InstitucionEducativaAcreditacionEspecialidadModule {}
