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
import { User as UserEntity } from 'src/users/entity/users.entity';

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
      
    }

    async getOfertaPlanEstudioAsignatura(idPlan:number, idRegimen:number, idAsignatura:number){
      const planAsignatura = await this.peaRepository.findOneBy(
        {
          'planEstudioCarreraId':idPlan,
          'regimenGradoTipoId':idRegimen,
          'asignaturaTipoId':idAsignatura
        }
      );
      return planAsignatura;
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

  async getAsignaturasPlanEstudioById(plan_estudio_asignatura_id: number)
  {
    let asignatura = await this.planEstudioAsignaturaRepository.getOneById(plan_estudio_asignatura_id)
    let asignaturas = []
    if(asignatura)
    {
      let list = await this.peaRepository.find({
        relations:{
          asignaturaTipo: true
        },
        where:{
          planEstudioCarreraId: asignatura.planEstudioCarreraId
        }
      })
      list.forEach(item => {
        asignaturas.push({id:item.asignaturaTipo.id,asignatura:item.asignaturaTipo.asignatura,abreviacion:item.asignaturaTipo.abreviacion})
      });

    }
    return asignaturas
  }
  async verificaPlanAsignatura(planes, dto) {
  
    // obtiene los que no fueron actualizados
    const eliminar = planes.filter(item2 => {
      return !dto.some(item1 => 
        item1.asignatura_tipo_id === item2.asignatura_tipo_id &&
        item1.regimen_grado_tipo_id === item2.regimen_grado_tipo_id
      );
    });
    
      //obtiene los que existen
    const existentes = planes.filter(item2 => {
      return dto.some(item1 => 
        item1.asignatura_tipo_id === item2.asignatura_tipo_id &&
        item1.regimen_grado_tipo_id === item2.regimen_grado_tipo_id
      );
    });
    const nuevos = dto.filter(item2 => {
      return !planes.some(item1 => 
        item1.asignatura_tipo_id === item2.asignatura_tipo_id &&
        item1.regimen_grado_tipo_id === item2.regimen_grado_tipo_id
      );
    });
    return  {
      existentes,
      eliminar,
      nuevos
    };
  }

    async crearPlanAsignatura (dto: CreatePlanAsignaturaPrerequisitoDto[],  user:UserEntity) {
      const resultado = [];
      //actualizamos e insertamos
        for(const item of dto){
              const planAsignatura = await this.getOfertaPlanEstudioAsignatura( item.plan_estudio_carrera_id, item.regimen_grado_tipo_id, item.asignatura_tipo_id);
              const op = async (transaction: EntityManager) => {
                //console.log(datoCalificacion);
                    if(planAsignatura){
                      const actualizados = await this.planEstudioAsignaturaRepository.updatePlanAsignaturaById(
                            planAsignatura.id,
                            item
                        )
                        resultado.push(actualizados);
                    }
                    if(!planAsignatura){
                      const nuevos = await this.planEstudioAsignaturaRepository.crearOnePlanEstudioAsignatura(
                                user.id,
                                item,
                                transaction
                            );
                            resultado.push(nuevos);
                     }
                }
                  const crearResult = await this.planEstudioAsignaturaRepository.runTransaction(op);
                  console.log(crearResult);
              
            }
            return resultado;
          
      }

      async eliminarPlanAsignatura (dto: CreatePlanAsignaturaPrerequisitoDto[]) {
        
        const planesAsignaturas = await this.planEstudioAsignaturaRepository.getAsignaturasByPLanEstudioId(dto[0].plan_estudio_carrera_id);
            const { existentes, eliminar,nuevos} = await this.verificaPlanAsignatura(planesAsignaturas, dto);

            console.log(existentes);
            console.log("-----------------eliminar:");
            console.log(eliminar);
            console.log("-----------------nuevos");
            console.log(nuevos);
            //eliminados y en cascada la regla si tuviera
            for(const item of eliminar){
              await this.pearRepository
              .createQueryBuilder()
              .delete()
              .from(PlanEstudioAsignaturaRegla)
              .where({anteriorPlanEstudioAsignaturaId:item.id})
              .execute();

                const planAsignatura = await this.getOfertaPlanEstudioAsignatura( item.plan_estudio_carrera_id, item.regimen_grado_tipo_id, item.asignatura_tipo_id);
                  await this.pearRepository
                .createQueryBuilder()
                .delete()
                .from(PlanEstudioAsignatura)
                .where({id:planAsignatura.id})
                .execute();

                 
                
              }
          return eliminar;
       }

       async crudReglaPlanEstudioAsignaturaById( dto, user){
        const reglas = [];
        for(const item of dto){
          const plan = await this.getOneByPlanAsignatura( item.plan_estudio_carrera_id, item.asignatura_tipo_id);
          const anterior = await this.getOneByPlanAsignatura( item.plan_estudio_carrera_id, item.prerequisito_id);
          if(item.prerequisito_id>0){
            const regla = await this.pearRepository.findOneBy({
              'planEstudioAsignaturaId':plan.id,
            });
 
            if(regla){ 
             
              if(item.prerequisito_id>0 && item.prerequisito_id!=regla.anteriorPlanEstudioAsignaturaId){
              //actualizamos el nuevo prerequisito
              
                  if(anterior){
                    console.log("actualizad");
                    const act =  await this.pearRepository
                          .createQueryBuilder()
                          .update(PlanEstudioAsignaturaRegla)
                          .set(
                            {
                                anteriorPlanEstudioAsignaturaId: anterior.id,
                            },
                          )
                          .where({id:regla.id})
                          .execute();
                          reglas.push(act);
                  }
              }
              //se eliminara el prerequsito si ya es 0 y existe
              if(item.prerequisito_id==0 && regla){
                console.log("borra");
                const borr = await this.pearRepository
                .createQueryBuilder()
                .delete()
                .from(PlanEstudioAsignaturaRegla)
                .where({id:regla.id})
                .execute();
                reglas.push(borr);
              }
          }
          //console.log("para el nuevo");
          //console.log(item.prerequisito_id);
          //console.log(regla);
            if(item.prerequisito_id>0 && !regla){
              console.log("insert");
             const nuev = await this.pearRepository
              .createQueryBuilder()
              .insert()
              .into(PlanEstudioAsignaturaRegla)
              .values([
                {
                    planEstudioAsignaturaId: plan.id,
                    anteriorPlanEstudioAsignaturaId: anterior.id,
                    activo:true,
                    usuarioId: user.id,
                    
                },
              ])
              .returning("id")
              .execute();

              reglas.push(nuev);
            }
          }
        }
        return reglas;
    }
    
      async crearPlanAsignaturaPrerequisito(dto: CreatePlanAsignaturaPrerequisitoDto[], user:UserEntity) {
             
             //creamos los planes estudio asignatura de todo el DTO
           const planesNuevos = await this.crearPlanAsignatura(dto, user);
              //eliminamos los no reportados tanto plan_estudio_asignatura como  la regla
           const eliminados = await this.eliminarPlanAsignatura(dto);
              //insertamos actualizamos o borramos las reglas
           const reglas = await this.crudReglaPlanEstudioAsignaturaById(dto, user);

           if(planesNuevos.length>0 ){
              return this._serviceResp.respuestaHttp201(
                planesNuevos,
                  'Registro de planes y requisitos Creado !!',
                  '',
              );
            }
            if(eliminados.length>0 ){
              return this._serviceResp.respuestaHttp201(
                eliminados,
                  'algunos planes fueron eliminados !!',
                  '',
              );
            }
            if(reglas.length>0 ){
              return this._serviceResp.respuestaHttp201(
                eliminados,
                  'algunas reglas  fueron actualizados o eliminados !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
      }

   //actualizacion individual de un plan_estudio_asignatura
      async editPlanEstudioAsignaturaById(id: number, dto:UpdatePlanEstudioAsignaturaDto,  user:UserEntity)
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
                  usuarioId: user.id
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
