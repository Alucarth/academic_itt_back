import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEstudioAsignatura } from 'src/academico/entidades/planEstudioAsignatura.entity';
import { PlanEstudioAsignaturaRegla } from 'src/academico/entidades/planEstudioAsignaturaRegla.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { CreatePlanAsignaturaPrerequisitoDto } from './dto/createPlanAsignaturaPrerequisito.dto';
import { CreatePlanEstudioAsignaturaDto } from './dto/createPlanEstudioAsignatura.dto';
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
       
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const cursos = await this.planEstudioAsignaturaRepository.getAll()
        return cursos
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
        if(pea){
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
      );
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

    async crearPlanAsignatura (dto: CreatePlanEstudioAsignaturaDto[]) {
       
        console.log("lista array inicio");
        console.log(dto);
        console.log(dto.length);
        console.log("lista array");
       /* const planesAsignaturas = this.planEstudioAsignaturaRepository.getAsignaturasByPLanEstudioUId();

        const  nuevos = this.verificarPlanAsignatura(
            usuarioRoles,
            roles
          )*/
            const op = async (transaction: EntityManager) => {

                const nuevoArray = await this.planEstudioAsignaturaRepository.crearPlanEstudioAsignatura(
                    1, 
                    dto, 
                    transaction
                );
              return nuevoArray;
            }
  
            const crearResult = await this.planEstudioAsignaturaRepository.runTransaction(op)
  
            if(crearResult.length>0){
              return this._serviceResp.respuestaHttp201(
                  crearResult,
                  'Registro de asignaturas Creado !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
      }
    

      async crearPlanAsignaturaPrerequisito(dto:CreatePlanAsignaturaPrerequisitoDto[]) {
      console.log(dto);
      
        try {
          const resultado = [];
              dto.forEach(async item => {
                
                const planAsignatura = await this.getOfertaPlanEstudioAsignatura(
                  item.plan_estudio_carrera_id,
                  item.regimen_grado_tipo_id,
                  item.asignatura_tipo_id
                );
                //await resultado.push(item);
                let planAsignaturaId = 0;
               

                if(!planAsignatura.data){
                    console.log("no existe ingresa");
                    const res = await this.peaRepository
                    .createQueryBuilder()
                    .insert()
                    .into(PlanEstudioAsignatura)
                    .values([
                        {
                            planEstudioCarreraId: item.plan_estudio_carrera_id,
                            regimenGradoTipoId: item.regimen_grado_tipo_id,
                            asignaturaTipoId: item.asignatura_tipo_id,
                            horas: item.horas,
                            usuarioId: 1,
                        },
                    ])
                    .returning("id")
                    .execute();
                    
                    console.log("res:", res);
                   // resultado.push(item);
                    
                    planAsignaturaId = res.identifiers[0].id;
                    
                }else{
                  planAsignaturaId = planAsignatura.data.id;
                }
        
                
                if(planAsignaturaId>0 && item.prerequisito_id>0){
                  console.log("existe un prerequisito" + item.prerequisito_id);
                  //buscamos el registro de la carrera anterior
                  const anterior = await this.getOneByPlanAsignatura( item.plan_estudio_carrera_id, item.prerequisito_id);
                  console.log(anterior);
                  if(anterior.data.id){
                    //buscamos si ya existe regla
                    const regla = await this.pearRepository.findOneBy({
                      'planEstudioAsignaturaId':planAsignaturaId,
                      'anteriorPlanEstudioAsignaturaId':anterior.data.id,
                    });
                    
                    if (!regla) {
                       await this.pearRepository
                      .createQueryBuilder()
                      .insert()
                      .into(PlanEstudioAsignaturaRegla)
                      .values([
                        {
                            planEstudioAsignaturaId: planAsignaturaId,
                            anteriorPlanEstudioAsignaturaId: anterior.data.id,
                            activo:true,
                            usuarioId: 1,
                        },
                      ])
                      .returning("id")
                      .execute();
                    }
                  }
                }

              });
             
                return this._serviceResp.respuestaHttp201(
                    resultado,
                    'Registro de plan y prerequisito Creado !!',
                    '',
                );
              
        } catch (error) {
            console.log("Error insertar plan y prerequisitos: ", error);
            throw new HttpException(
              {
                status: HttpStatus.CONFLICT,
                error: `Error insertar Matricula: ${error.message}`,
              },
              HttpStatus.ACCEPTED,
              {
                cause: error,
              }
            );
        }
   
      }
}
