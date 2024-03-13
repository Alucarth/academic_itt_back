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
          where iee.institucion_educativa_sucursal_id  = ${payload.institucion_educativa_sucursal_id} and iee.persona_id = ${payload.persona_id} and me.gestion_tipo_id <  ${payload.gestion_tipo_id} and ca.carrera_tipo_id =  ${payload.carrera_tipo_id};
      `)
      

      await Promise.all(resolutions.map(async (resolution: any)=> {
        // aqui se obtiene los semestre o años aprobados
        const regimenes_grado = await this._institutoPlanEstudioCarreraRepository.query(`
            select rgt.id, rgt.regimen_grado, oc.gestion_tipo_id 
            from institucion_educativa_estudiante iee 
            inner join matricula_estudiante me on me.institucion_educativa_estudiante_id = iee.id
            inner join instituto_estudiante_inscripcion iei on iei.matricula_estudiante_id  = me.id
            inner join aula a on a.id = iei.aula_id 
            inner join oferta_curricular oc on oc.id = a.oferta_curricular_id 
            inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
            inner join asignatura_tipo at2 on at2.id = pea.asignatura_tipo_id 
            inner join regimen_grado_tipo rgt on rgt.id = pea.regimen_grado_tipo_id 
            inner join estado_matricula_tipo emt on emt.id = iei.estadomatricula_tipo_id 
            where iee.institucion_educativa_sucursal_id  =  ${payload.institucion_educativa_sucursal_id} and iee.persona_id = ${payload.persona_id} and me.instituto_plan_estudio_carrera_id = ${resolution.instituto_plan_estudio_carrera_id} and iei.estadomatricula_tipo_id = 30 
            group by rgt.regimen_grado, rgt.id, oc.gestion_tipo_id ;
        `)
          let subject_student = []
          let is_complete = true
        await Promise.all( regimenes_grado.map(async (regimen_grado: any)=>{

            //aqui se obtiene las materias de un semestre o año  aprobados
            let notes  = await this._institutoPlanEstudioCarreraRepository.query(`
                select rgt.regimen_grado, oc.gestion_tipo_id  ,at2.asignatura, at2.abreviacion, emt.estado_matricula,
                        (select iedc.cuantitativa as nota_final from instituto_estudiante_inscripcion_docente_calificacion iedc where iedc.instituto_estudiante_inscripcion_id = iei.id and iedc.modalidad_evaluacion_tipo_id = 7 and iedc.nota_tipo_id = 7 )
                from institucion_educativa_estudiante iee 
                inner join matricula_estudiante me on me.institucion_educativa_estudiante_id = iee.id
                inner join instituto_estudiante_inscripcion iei on iei.matricula_estudiante_id  = me.id
                inner join aula a on a.id = iei.aula_id 
                inner join oferta_curricular oc on oc.id = a.oferta_curricular_id 
                inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
                inner join asignatura_tipo at2 on at2.id = pea.asignatura_tipo_id 
                inner join regimen_grado_tipo rgt on rgt.id = pea.regimen_grado_tipo_id 
                inner join estado_matricula_tipo emt on emt.id = iei.estadomatricula_tipo_id 
                where iee.institucion_educativa_sucursal_id  = ${payload.institucion_educativa_sucursal_id} and iee.persona_id = ${payload.persona_id} and me.instituto_plan_estudio_carrera_id = ${resolution.instituto_plan_estudio_carrera_id} and iei.estadomatricula_tipo_id = 30 and pea.regimen_grado_tipo_id = ${regimen_grado.id};
            `)
            let subjects = await this._institutoPlanEstudioCarreraRepository.query(`
                select rgt.regimen_grado, at3.asignatura, at3.abreviacion  from plan_estudio_carrera pec 
                inner join plan_estudio_asignatura pea on pea.plan_estudio_carrera_id = pec.id
                inner join asignatura_tipo at3 on at3.id = pea.asignatura_tipo_id
                inner join regimen_grado_tipo rgt on rgt.id = pea.regimen_grado_tipo_id
                inner join instituto_plan_estudio_carrera ipec on ipec.plan_estudio_carrera_id = pec.id 
                where ipec.id = ${resolution.instituto_plan_estudio_carrera_id} and pea.regimen_grado_tipo_id = ${regimen_grado.id} order by at3.asignatura asc ;
            
            `)
            subject_student = []  
            is_complete = true
            await Promise.all(subjects.map( (subject: any) =>{
                const result = notes.filter((note: any) => note.asignatura === subject.asignatura )
                if(result.length > 0)
                {
                  subject_student.push(result[0])
                }else{
                  subject_student.push( {
                    regimen_grado: subject.regimen_grado,
                    gestion_tipo_id: null,
                    asignatura: subject.asignatura,
                    abreviacion: subject.abreviacion,
                    estado_matricula: 'SIN APROBAR',
                    nota_final: null
                  })
                  is_complete = false
                }
            } ))
            regimen_grado.is_complete = is_complete

            regimen_grado.notes = subject_student

        }))

        resolution.regimenes_grado = regimenes_grado


      }))

      
      

      return resolutions
    }
     
}
