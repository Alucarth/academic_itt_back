import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionEducativaImagen } from 'src/academico/entidades/institucionEducativaImagen.entity';
import { DatabaseModule } from 'src/database/database.module';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { InstitucionEducativaImagenController } from './institucion_educativa_imagen.controller';
import { InstitucionEducativaImagenRepository } from './institucion_educativa_imagen.repository';
import { InstitucionEducativaImagenService } from './institucion_educativa_imagen.service';
import { TblAuxiliarSie } from 'src/academico/entidades/tblAuxiliarSie';

@Module({
  imports:[DatabaseModule,
  TypeOrmModule.forFeature([InstitucionEducativaImagen]),
  TypeOrmModule.forFeature([TblAuxiliarSie], "siedb"),
  ],
  controllers: [InstitucionEducativaImagenController],
  providers: [InstitucionEducativaImagenService,
  InstitucionEducativaImagenRepository,
  RespuestaSigedService,]
})
export class InstitucionEducativaImagenModule {}
