import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateInstitutoPlanEstudioCarreraDto } from './dto/createInstitutoPlanEstudioCarrera.dto';
import { InstitutoPlanEstudioCarreraRepository } from './instituto_plan_estudio_carrera.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';
@Injectable()
export class InstitutoPlanEstudioCarreraService {
    constructor(
        @Inject(InstitutoPlanEstudioCarreraRepository)
        private institutoPlanEstudioCarreraRepository: InstitutoPlanEstudioCarreraRepository,
        @InjectRepository(InstitutoPlanEstudioCarrera)
        private _institutoPlanEstudioCarreraRepository: Repository<InstitutoPlanEstudioCarrera>,
        private _serviceResp: RespuestaSigedService, 
    ){}

    async getAll(){
        const data = await this.institutoPlanEstudioCarreraRepository.getAll();
        return data;

    }
    async getOneById(id){
        const data = await this.institutoPlanEstudioCarreraRepository.findOneById(id);
        if (data){
          return this._serviceResp.respuestaHttp201(
            data,
            "Registro econtrado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp401(
          "",
          "No hay resultados !!",
          ""
        );
    }
    async getGradosById(id){
        const data = await this.institutoPlanEstudioCarreraRepository.findGradosBy(id);
        if (data){
          return this._serviceResp.respuestaHttp201(
            data,
            "Registro econtrado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp401(
          "",
          "No hay resultados !!",
          ""
        );
    }
    async getAsignaturasGradosById(id, grado){
        const data = await this.institutoPlanEstudioCarreraRepository.findAsignaturasGradoBy(id, grado);
        if (data){
          return this._serviceResp.respuestaHttp201(
            data,
            "Registro econtrado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp401(
          "",
          "No hay resultados !!",
          ""
        );
    }
    async getOneByPlanCarrera(plan_id:number, carrera_id:number){
        const data = await this.institutoPlanEstudioCarreraRepository.findOneByPlanCarrera(plan_id, carrera_id);
        if (data){
          return this._serviceResp.respuestaHttp201(
            data,
            "Registro econtrado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp401(
          "",
          "No hay resultados !!",
          ""
        );
    }
    async getResolucionesCarreraAutorizadaId( id:number ){
       const result = await this.institutoPlanEstudioCarreraRepository.findResolucionesCarreraAutorizadaId(id);
       return result;    
    }
    
    // async getResolutionsCareer(carrera_autorizada_id)
    // {
    //   const result = await this._institutoPlanEstudioCarreraRepository.find({
    //     relations:{
    //       planEstudioCarrera: {
    //         planEstudioResolucion: true,
    //         planesAsignaturas: {
    //           asignaturaTipo: true,
    //           regimenGradoTipo: true,
              

    //         },
    //       }
    //     },
    //     where: { carreraAutorizadaId: carrera_autorizada_id }
    //   })
    // }

    async getPlanAsignaturaById( id:number ){
        const result = await this.institutoPlanEstudioCarreraRepository.findPlanAsignaturasById(id);
        return result;
    }

    async createInstitutoPlan (dto: CreateInstitutoPlanEstudioCarreraDto, user:UserEntity) {
      const institutoPlanCarrera = await this.getOneByPlanCarrera(dto.plan_estudio_carrera_id, dto.carrera_autorizada_id);
      //console.log("institutoPlanCarrera____", institutoPlanCarrera);
        if(institutoPlanCarrera.data!=''){ //console.log("ya existe ")
          return this._serviceResp.respuestaHttp201(
            institutoPlanCarrera,
            "El registro de instituto plan ya existe!!",
            ""
          );
        }else{ //console.log("crea")
            const op = async (transaction: EntityManager) => {
              const nuevoInstitutoPlan =  await this.institutoPlanEstudioCarreraRepository.createInstitutoPlanEstudioCarrera(
                user.id,
                dto,
                transaction
              )
              return nuevoInstitutoPlan;
            }
  
            const crearResult = await this.institutoPlanEstudioCarreraRepository.runTransaction(op)
            const plan_estudio_carrera =  await this._institutoPlanEstudioCarreraRepository.findOne(
              {
                relations:{
                  planEstudioCarrera: {
                    planEstudioResolucion :true
                  }
                },
                where: { id: crearResult.id}
              }
            )

            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  plan_estudio_carrera,
                  'Registro de instituo_plan Creado !!',
                  '',
              );
            }
          }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
    }

    async getResolutionsStudent( payload : any)
    {
      const resolutions = await this._institutoPlanEstudioCarreraRepository.query(`
          select  me.instituto_plan_estudio_carrera_id , per.numero_resolucion, ipec.plan_estudio_carrera_id,  igt.intervalo_gestion , ct.carrera from institucion_educativa_estudiante iee
          inner join matricula_estudiante me on me.institucion_educativa_estudiante_id = iee.id
          inner join instituto_plan_estudio_carrera ipec on ipec.id = me.instituto_plan_estudio_carrera_id
          inner join plan_estudio_carrera pec on pec.id = ipec.plan_estudio_carrera_id
          inner join plan_estudio_resolucion per on per.id = pec.plan_estudio_resolucion_id
          inner join carrera_autorizada ca on ca.id = ipec.carrera_autorizada_id
          inner join carrera_tipo ct on ct.id= ca.carrera_tipo_id
          inner join intervalo_gestion_tipo igt on igt.id = pec.intervalo_gestion_tipo_id
          where iee.institucion_educativa_sucursal_id  = ${payload.institucion_educativa_sucursal_id} and iee.persona_id = ${payload.persona_id} and me.gestion_tipo_id !=  ${payload.gestion_tipo_id} and ca.carrera_tipo_id =  ${payload.carrera_tipo_id};
      `)
      return resolutions
    }
     
}
