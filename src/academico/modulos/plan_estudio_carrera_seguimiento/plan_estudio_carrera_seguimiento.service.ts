import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEstudioCarreraSeguimiento } from 'src/academico/entidades/planEstudioCarreraSeguimiento.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { DataSource, Repository } from 'typeorm';
import { CreateSeguimientoDto } from './dto/createSeguimiento.dto';
import { User as UserEntity } from 'src/users/entity/users.entity';


@Injectable()
export class PlanEstudioCarreraSeguimientoService {
    constructor(
        @InjectRepository(PlanEstudioCarreraSeguimiento)
        private planEstudioCarreraSeguimientoRepository: Repository<PlanEstudioCarreraSeguimiento>,
        private _serviceResp: RespuestaSigedService,
        private dataSource: DataSource,
      ) {}

    async getAll(){
        const seguimientos = await this.planEstudioCarreraSeguimientoRepository.find();
        return seguimientos;
    }
    async getAllProcesosCarrera(id:number) {
        // revisado
        //const result = await this.carreraTipoRepository.find();
       // const solocursoscortos = 2
        const result = await this.dataSource
          .getRepository(PlanEstudioCarreraSeguimiento)
          .createQueryBuilder("a")
          .innerJoinAndSelect("a.procesoTipo", "p")
          .select([
              "a.id",
              "a.usuarioId",
              "a.fechaRegistro",
              "a.observacion",
              "p.id",
              "p.proceso",
            ])
          .where("a.planEstudioCarreraId = :id", { id })
          .orderBy("a.fechaRegistro","ASC")
          .getMany();
    
        console.log(result);
    
        return this._serviceResp.respuestaHttp200(
          result,
          "",
          "Registro Encontrado !!"
        );
      }
    async create(dto: CreateSeguimientoDto, user: UserEntity) {
        //evitar duplicados en asignatura y abreviacion
        try {
          const res = await this.planEstudioCarreraSeguimientoRepository
            .createQueryBuilder()
            .insert()
            .into(PlanEstudioCarreraSeguimiento)
            .values([
              {
                procesoTipoId: dto.procesoTipoId,
                observacion: dto.observacion,
                planEstudioCarreraId: dto.planEstudioCarreraId,
                usuarioId: user.id,
              },
            ])
            .execute();
    
          console.log("res:", res);
          console.log("seguimiento adicionado");
          return this._serviceResp.respuestaHttp201(
            res.identifiers[0].id,
            "Registro Creado !!",
            ""
          );
        } catch (error) {
          console.log("Error insertar asignaturatipo: ", error);
          throw new HttpException(
            {
              status: HttpStatus.CONFLICT,
              error: `Error insertar asignaturatipo: ${error.message}`,
            },
            HttpStatus.ACCEPTED,
            {
              cause: error,
            }
          );
        }
      }
}
