import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../../users/entity/users.entity";
import { MallaCurricularController } from './malla-curricular.controller';
import { MallaCurricularService } from './malla-curricular.service';
import { DatabaseModule } from "../../../database/database.module";
import { RespuestaSigedService } from "../../../shared/respuesta.service";


@Module({
  imports: [
    DatabaseModule,    
    TypeOrmModule.forFeature([User])
  ],
  controllers: [MallaCurricularController],
  providers: [MallaCurricularService, RespuestaSigedService],
  exports: [MallaCurricularService],
})
export class MallaCurricularModule {}
