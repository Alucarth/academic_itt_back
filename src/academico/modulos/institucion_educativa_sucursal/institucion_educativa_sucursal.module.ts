import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { DatabaseModule } from 'src/database/database.module';
import { InstitucionEducativaSucursalRepository } from './institucion_educativa_sucursal.repository';
import { InstitucionEducativaSucursalController } from './institucion_educativa_sucursal.controller';
import { InstitucionEducativaSucursalService } from './institucion_educativa_sucursal.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([
    InstitucionEducativaSucursal
  ])],
  controllers: [InstitucionEducativaSucursalController],
  providers: [InstitucionEducativaSucursalService,
              InstitucionEducativaSucursalRepository]
})
export class InstitucionEducativaSucursalModule {}
