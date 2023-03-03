import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operativo } from 'src/academico/entidades/operativo.entity';
import { DatabaseModule } from 'src/database/database.module';
import { OperativoController } from './operativo.controller';
import { OperativoService } from './operativo.service';

@Module({
  imports:[DatabaseModule, TypeOrmModule.forFeature([Operativo])],
  controllers: [OperativoController],
  providers: [OperativoService]
})
export class OperativoModule {}
