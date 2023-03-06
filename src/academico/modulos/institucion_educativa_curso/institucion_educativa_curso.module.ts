import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { DatabaseModule } from 'src/database/database.module';
import { InstitucionEducativaCursoController } from './institucion_educativa_curso.controller';
import { InstitucionEducativaCursoService } from './institucion_educativa_curso.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([InstitucionEducativaCurso])],
  controllers: [InstitucionEducativaCursoController],
  providers: [InstitucionEducativaCursoService]
})
export class InstitucionEducativaCursoModule {}
