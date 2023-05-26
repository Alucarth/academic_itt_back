import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaTipo } from 'src/academico/entidades/areaTipo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { AreaTipoController } from './area_tipo.controller';
import { AreaTipoService } from './area_tipo.service';
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([AreaTipo])],
  controllers: [AreaTipoController],
  providers: [AreaTipoService, RespuestaSigedService, JwtService],
})
export class AreaTipoModule {}
