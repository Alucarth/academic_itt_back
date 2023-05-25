import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { AulaDocenteRepository } from './aula_docente.repository';
import { CreateAulaDocenteDto } from './dto/createAulaDocente.dto';

@Injectable()
export class AulaDocenteService {
    constructor(
        @Inject(AulaDocenteRepository)
        private aulaDocenteRepositorio: AulaDocenteRepository,
        
        private _serviceResp: RespuestaSigedService
      ) {}
      async getAll() {
        const aulas = await this.aulaDocenteRepositorio.findAll();
        return aulas;
      }
      async getCarrerasByDocenteId(id:number){
        const aulas = await this.aulaDocenteRepositorio.findAllCarrerasByDocenteId(id);
        if (aulas){
          return this._serviceResp.respuestaHttp201(
            aulas,
            "resultados encontrados !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp404(
          "",
          "no existen resultados !!",
          ""
        );
      }

      async crearDocenteAula (dto: CreateAulaDocenteDto[]) {
          console.log("lista array inicio");
          console.log(dto);
          console.log(dto.length);
          console.log("lista array");

            const op = async (transaction: EntityManager) => {
                const nuevo = await this.aulaDocenteRepositorio.crearDocentesAulas(
                    1, 
                    dto, 
                    transaction
                );
              return nuevo;
            }
  
            const crearResult = await this.aulaDocenteRepositorio.runTransaction(op)
  
            if(crearResult.length>0){
              return this._serviceResp.respuestaHttp201(
                  crearResult,
                  'Registro Creado !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
      }
}
