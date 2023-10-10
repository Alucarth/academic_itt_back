import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { AulaDocenteRepository } from './aula_docente.repository';
import { CreateAulaDocenteDto } from './dto/createAulaDocente.dto';
import { User as UserEntity } from 'src/users/entity/users.entity';

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
      async getCarrerasByPersonaId(id:number){
        const aulas = await this.aulaDocenteRepositorio.findAllCarrerasByPersonaId(id);
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
      async getCarrerasDocentesAulasByPersonaId(id:number){
        const aulas = await this.aulaDocenteRepositorio.findAllCarrerasDocentesAulasByPersonaId(id);
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
   
      async crearAulaDocenteAntes (dto: CreateAulaDocenteDto[], user:UserEntity) {
        console.log("lista array inicio");
        console.log(dto);
        console.log(dto.length);
        console.log("lista array");
        const resultado = [];
        for(const item of dto){
          //buscamos docente en esa aula
          const docente = await this.aulaDocenteRepositorio.getOneDocenteByAulaId(item.aula_id);
          const op = async (transaction: EntityManager) => {
            //console.log(datoCalificacion);
                if(docente && docente.maestro_inscripcion_id!=item.maestro_inscripcion_id){
                  console.log("desactiva");
                  const actualizados = await this.aulaDocenteRepositorio.updateDocenteAulaVigencia(
                        docente.id,
                        item.fecha_inicio
                    );
                    resultado.push(actualizados);
                }
                if(!docente || docente.maestro_inscripcion_id!=item.maestro_inscripcion_id){
                  console.log("inserta");
                  const nuevos = await this.aulaDocenteRepositorio.crearDocenteAula(
                            user.id,
                            item,
                            transaction
                        );
                        resultado.push(nuevos);
                 }
                 
                 if(docente && docente.maestro_inscripcion_id==item.maestro_inscripcion_id){
                  console.log("edita");
                  const actualizados = await this.aulaDocenteRepositorio.updateDocenteAula(
                            docente.id,
                            item
                        );
                        resultado.push(actualizados);
                 }
            }
              const crearResult = await this.aulaDocenteRepositorio.runTransaction(op);
              console.log(crearResult);
          
        }
        //return resultado;
          if(resultado.length>0){
            return this._serviceResp.respuestaHttp201(
                resultado,
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
      async crearAulaDocente (dto: CreateAulaDocenteDto[], user:UserEntity) {
          console.log("lista array inicio");
          console.log(dto);
          console.log(dto.length);
          console.log("lista array");
          const resultado = [];
          for(const item of dto){
            //buscamos docente en esa aula
            const docente = await this.aulaDocenteRepositorio.getOneAulaDocente(item.aula_id, item.maestro_inscripcion_id);
            console.log("existe docente",docente);
            const op = async (transaction: EntityManager) => {
              //console.log(datoCalificacion);
                  await this.aulaDocenteRepositorio.updateDocenteAulaVigenciaByAula(
                    item.aula_id,
                    item.fecha_inicio
                  );
                  if(!docente){
                    console.log("desactiva  alos otros");
                    //desactiva a otros docentes de esa aula
                   
                    console.log("inserta el nuevo");
                    const nuevos = await this.aulaDocenteRepositorio.crearDocenteAula(
                              user.id,
                              item,
                              transaction
                          );
                          resultado.push(nuevos);
                   }
                   if(docente){
                    console.log("edita");
                    const actualizados = await this.aulaDocenteRepositorio.updateDocenteAula(
                              docente.id,
                              item
                          );
                          resultado.push(actualizados);
                   }
              }
                const crearResult = await this.aulaDocenteRepositorio.runTransaction(op);
                console.log(crearResult);
            
          }
          //return resultado;
            if(resultado.length>0){
              return this._serviceResp.respuestaHttp201(
                  resultado,
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
      async crearDocenteAulaArray (dto: CreateAulaDocenteDto[]) {
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
