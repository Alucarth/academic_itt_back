import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEstudioAsignatura } from 'src/academico/entidades/planEstudioAsignatura.entity';
import { PlanEstudioAsignaturaRegla } from 'src/academico/entidades/planEstudioAsignaturaRegla.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { PlanEstudioAsignaturaReglaRepository } from '../plan_estudio_asignatura_regla/plan_estudio_asignatura_regla.repository';
import { CreatePlanAsignaturaPrerequisitoDto } from './dto/createPlanAsignaturaPrerequisito.dto';
import { CreatePlanEstudioAsignaturaDto } from './dto/createPlanEstudioAsignatura.dto';
import { UpdatePlanEstudioAsignaturaDto } from './dto/updatePlanEstudioAsignatura.dto';
import { PlanEstudioAsignaturaRepository } from './plan_estudio_asignatura.repository';

@Injectable()
export class PlanEstudioAsignaturaService {
    constructor(
        @InjectRepository(PlanEstudioAsignatura)
        private peaRepository: Repository<PlanEstudioAsignatura>,

        @InjectRepository(PlanEstudioAsignaturaRegla)
        private pearRepository: Repository<PlanEstudioAsignaturaRegla>,

        @Inject(PlanEstudioAsignaturaRepository) 
        private planEstudioAsignaturaRepository: PlanEstudioAsignaturaRepository,

        @Inject(PlanEstudioAsignaturaReglaRepository) 
        private planEstudioAsignaturaReglaRepository: PlanEstudioAsignaturaReglaRepository,
       
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const cursos = await this.planEstudioAsignaturaRepository.getAll()
        return cursos
    }
    
    async getById(id: number){
      const planAsignatura = await this.planEstudioAsignaturaRepository.getOneById(id);
          return planAsignatura;
    }

    async getAsignaturasByPlanRegimen(idplan:number, idregimen:number){
        const cursos = await this.planEstudioAsignaturaRepository.findAsignaturasByPlanRegimen(idplan, idregimen);
        if(cursos){
            return this._serviceResp.respuestaHttp201(
              cursos,
              'Resultados encontrados !!',
              '',
          );
        }
        return this._serviceResp.respuestaHttp404(
          "",
          'No se encontraron resultados !!',
          '',
      );
    }
    async getOneByPlanAsignatura(idPlan:number, idAsignatura:number){
        const pea = await this.planEstudioAsignaturaRepository.findOneByPlanAsignatura(idPlan, idAsignatura);
        return pea;
       /* if(pea){
            return this._serviceResp.respuestaHttp201(
              pea,
              'Resultados encontrados !!',
              '',
          );
        }
        return this._serviceResp.respuestaHttp404(
          "",
          'No se encontraron resultados !!',
          '',
      );*/
    }

    async getOfertaPlanEstudioAsignatura(idPlan:number, idRegimen:number, idAsignatura:number){
      const planAsignatura = await this.peaRepository.findOneBy(
        {
          'planEstudioCarreraId':idPlan,
          'regimenGradoTipoId':idRegimen,
          'asignaturaTipoId':idAsignatura
        }
      );
      if(planAsignatura){
          return this._serviceResp.respuestaHttp201(
            planAsignatura,
            'Resultados encontrados !!',
            '',
        );
      }
      return this._serviceResp.respuestaHttp404(
        "",
        'No se encontraron resultados !!',
        '',
    );
  }

    async getAsignaturasPrerequisitosByPlan(id:number){
      const cursos = await this.planEstudioAsignaturaRepository.findAsignaturasPrerequisitosByPlan(id);
      if(cursos){
          return this._serviceResp.respuestaHttp201(
            cursos,
            'Resultados encontrados !!',
            '',
        );
      }
      return this._serviceResp.respuestaHttp404(
        "",
        'No se encontraron resultados !!',
        '',
    );
  }
  verificaPlanAsignatura(planes, dto) {
  
    const nuevos = dto.filter((d) =>
            planes.every((p) =>  p.asignaturTipoId == d.asignatura_tipo_id )
     );
    return  nuevos;
  }
    async crearPlanAsignatura (dto: CreatePlanAsignaturaPrerequisitoDto[]) {
       
        const planesAsignaturas = await this.planEstudioAsignaturaRepository.getAsignaturasByPLanEstudioId(dto[0].plan_estudio_carrera_id);

        const  nuevos = await this.verificaPlanAsignatura(
            planesAsignaturas,
            dto
          )
          console.log("los nuevos");
          console.log(nuevos);
          
            const op = async (transaction: EntityManager) => {

                const nuevoArray = await this.planEstudioAsignaturaRepository.crearPlanEstudioAsignatura(
                    1, 
                    nuevos, 
                    transaction
                );
              return nuevoArray;
            }
  
            const crearResult = await this.planEstudioAsignaturaRepository.runTransaction(op);
  
            if(crearResult.length>0){
              return crearResult;
                 
            }
            return this._serviceResp.respuestaHttp500(
              nuevos,
              'No se pudo guardar la información !!',
              '',
          );
      }
    
      async crearPlanAsignaturaPrerequisito(dto: CreatePlanAsignaturaPrerequisitoDto[]) {
             
             //creamos los planes estudio asignatura
              const planes = await this.crearPlanAsignatura(dto);
              //insertamos las reglas
              dto.forEach(async item => {
                  if(item.prerequisito_id>0){
                    const plan = await this.getOneByPlanAsignatura( item.plan_estudio_carrera_id, item.asignatura_tipo_id);
                    const anterior = await this.getOneByPlanAsignatura( item.plan_estudio_carrera_id, item.prerequisito_id);
                   
                    const regla = await this.pearRepository.findOneBy({
                      'planEstudioAsignaturaId':plan.id,
                      'anteriorPlanEstudioAsignaturaId':anterior.id,
                    });
                    
                    if (!regla) {
                      console.log(anterior.id);
                      const res1 = await this.pearRepository
                      .createQueryBuilder()
                      .insert()
                      .into(PlanEstudioAsignaturaRegla)
                      .values([
                        {
                            planEstudioAsignaturaId: plan.id,
                            anteriorPlanEstudioAsignaturaId: anterior.id,
                            activo:true,
                            usuarioId: 1,
                        },
                      ])
                      .returning("id")
                      .execute();
                    }
                  }
                });
            if(planes.length>0){
              return this._serviceResp.respuestaHttp201(
                  planes,
                  'Registro de planes y requisitos Creado !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
      }

      async editPlanEstudioAsignaturaById(id: number, dto:UpdatePlanEstudioAsignaturaDto)
      {
          const dato = await this.getById(id);
        if(dato){
          const res = await this.planEstudioAsignaturaRepository.updatePlanAsignaturaById(id,dto);
        
          const regla = await this.pearRepository.findOneBy({
            'planEstudioAsignaturaId':id,
          });
          const anterior = await this.getOneByPlanAsignatura(dato.planEstudioCarreraId, dto.prerequisito_id);

          if(regla){ 
              if(dto.prerequisito_id>0 && dto.prerequisito_id!=regla.anteriorPlanEstudioAsignaturaId){
              //actualizamos el nuevo prerequisito
              if(anterior){
                    await this.pearRepository
                        .createQueryBuilder()
                        .update(PlanEstudioAsignaturaRegla)
                        .set(
                          {
                              anteriorPlanEstudioAsignaturaId: anterior.id,
                          },
                        )
                        .where({id:regla.id})
                        .execute();
                }
            }
            //se eliminara el prerequsito si ya es 0 y existe
            if(dto.prerequisito_id==0 && regla){
              await this.pearRepository
              .createQueryBuilder()
              .delete()
              .from(PlanEstudioAsignaturaRegla)
              .where({id:regla.id})
              .execute();
            }
          }
          if(dto.prerequisito_id>0 && !regla){
            await this.pearRepository
            .createQueryBuilder()
            .insert()
            .into(PlanEstudioAsignaturaRegla)
            .values([
              {
                  planEstudioAsignaturaId: dato.id,
                  anteriorPlanEstudioAsignaturaId: anterior.id,
                  activo:true,
                  usuarioId: 1,
              },
            ])
            .returning("id")
            .execute();
          }

          if(res){
              console.log("res:", res);
              console.log("Asignatura actualizado");
              return this._serviceResp.respuestaHttp202(
              res,
              "Registro Actualizado !!",
              ""
              );
          }
          //si se desea actualizar el prerequsiito
        }else{
          return this._serviceResp.respuestaHttp500(
          "",
          "Error, el registro no existe  !!",
          ""
          );
      }
    }
}
