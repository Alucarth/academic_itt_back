import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseModule } from "src/database/database.module";
import { AsignaturaTipo } from "../../entidades/asignaturaTipo.entity";
import { AsignaturaTipoController } from './asignatura_tipo.controller';
import { AsignaturaTipoService } from './asignatura_tipo.service';
import { RespuestaSigedService } from "../../../shared/respuesta.service";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([AsignaturaTipo])],
  controllers: [AsignaturaTipoController],
  providers: [AsignaturaTipoService, RespuestaSigedService],
})
export class AsignaturaTipoModule {}
