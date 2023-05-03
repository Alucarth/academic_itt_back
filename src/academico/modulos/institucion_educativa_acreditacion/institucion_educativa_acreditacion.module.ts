import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionEducativaAcreditacion } from 'src/academico/entidades/institucionEducativaAcreditacion.entity';
import { DatabaseModule } from 'src/database/database.module';
import { InstitucionEducativaAcreditacionController } from './institucion_educativa_acreditacion.controller';
import { InstitucionEducativaAcreditacionRepository } from './institucion_educativa_acreditacion.repository';
import { InstitucionEducativaAcreditacionService } from './institucion_educativa_acreditacion.service';

@Module({
  imports:[
    DatabaseModule,
    TypeOrmModule.forFeature([
      InstitucionEducativaAcreditacion
    ])
  ],
  controllers: [InstitucionEducativaAcreditacionController],
  providers: [
    InstitucionEducativaAcreditacionService,
    InstitucionEducativaAcreditacionRepository
  ]
})
export class InstitucionEducativaAcreditacionModule {}
