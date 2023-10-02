import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { InstitutoPlanEstudioCarreraRepository } from '../instituto_plan_estudio_carrera/instituto_plan_estudio_carrera.repository';
import { InstitutoPlanEstudioCarreraService } from '../instituto_plan_estudio_carrera/instituto_plan_estudio_carrera.service';
import { OfertaCurricularRepository } from '../oferta_curricular/oferta_curricular.repository';
import { PlanEstudioCarreraRepository } from '../plan_estudio_carrera/plan_estudio_carrera.repository';
import { PlanEstudioCarreraService } from '../plan_estudio_carrera/plan_estudio_carrera.service';
import { CreatePlanEstudioResolucionDto } from './dto/createPlanEstudioResolucion.dto';
import { CreateResolucionDto } from './dto/createResolucion.dto';
import { PlanEstudioResolucionRepository } from './plan_estudio_resolucion.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';

@Injectable()
export class PlanEstudioResolucionService {
    constructor(
        
        @Inject(PlanEstudioResolucionRepository) 
        private planEstudioResolucionRepository: PlanEstudioResolucionRepository,

        @Inject(CarreraAutorizadaRepository) 
        private carreraAutorizadaRepository: CarreraAutorizadaRepository,

        @Inject(PlanEstudioCarreraRepository) 
        private planEstudioCarreraRepository: PlanEstudioCarreraRepository,

        @Inject(OfertaCurricularRepository) 
        private ofertaCurricularRepository: OfertaCurricularRepository,
       
        @Inject(InstitutoPlanEstudioCarreraRepository) 
        private institutoPlanEstudioCarreraRepository: InstitutoPlanEstudioCarreraRepository,
       
        private servicePlanEstudioCarrera: PlanEstudioCarreraService,
        private serviceInstitutoPlanEstudioCarrera: InstitutoPlanEstudioCarreraService,

        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getOnlyResoluciones(){
        const result = await this.planEstudioResolucionRepository.findResoluciones()
        return this._serviceResp.respuestaHttp200(
            result,
            "",
            "Registros Encontrados !!"
          );
        
    }
    
    async getResolucionesAll(){
        const result = await this.planEstudioResolucionRepository.findResolucionesAll()
        return this._serviceResp.respuestaHttp200(
            result,
            "",
            "Registros Encontrados !!"
          );
        
    }
    async getListaCarrerasResoluciones(){
        const result = await this.planEstudioResolucionRepository.findListaResoluciones()
        return this._serviceResp.respuestaHttp200(
            result,
            "",
            "Registros Encontrados !!"
          );
        
    }
    async getAll(){
        const cursos = await this.planEstudioResolucionRepository.getAll()
        return cursos
    }
    async createNewResolucion(dto: CreateResolucionDto,user: UserEntity) {
        //1:BUSCAR resolucion
        let datoResolucion = await this.planEstudioResolucionRepository.getByDato(dto);
          console.log("resolucion : ", datoResolucion);
          if (datoResolucion) {
            return this._serviceResp.respuestaHttp409(
                datoResolucion,
                'Registro de resol ya existe !!',
                '',
              );
          }

        const op = async (transaction: EntityManager) => {
            return await this.planEstudioResolucionRepository.crearNuevaResolucion(
                user.id,
                dto,
                transaction
              )
        }
        const crearResult = await this.planEstudioResolucionRepository.runTransaction(op);
        
        console.log(crearResult);

        if(crearResult){
          return this._serviceResp.respuestaHttp201(
            crearResult,
              'Registro de resol es Creado !!',
              '',
          );
        }
        return this._serviceResp.respuestaHttp500(
          "",
          'No se pudo guardar la información !!',
          '',
      );
    }


    async crear(dto: CreatePlanEstudioResolucionDto,  user: UserEntity) {
        
        // verificar la carrera ya existe
      const carreraAutorizada =await this.carreraAutorizadaRepository.getCarreraAutorizadaById(dto.carrera_autorizada_id);
      //console.log(carreraAutorizada);
        const op = async (transaction: EntityManager) => {

            const planResolucion = await this.createNewResolucion(dto, user);
            if(planResolucion.data?.id){ 
                //console.log("creoResol");
                //crear plan estudio carrera
                let datos = {
                    plan_estudio_resolucion_id: planResolucion.data?.id,
                    carrera_tipo_id: carreraAutorizada.carrera_id,                   
                    area_tipo_id: carreraAutorizada.area_id,
                    tiempo_estudio: carreraAutorizada.tiempo_estudio,
                    carga_horaria: carreraAutorizada.carga_horaria,
                    nivel_academico_tipo_id: carreraAutorizada.nivel_academico_tipo_id,
                    intervalo_gestion_tipo_id: carreraAutorizada.intervalo_gestion_tipo_id,
                    denominacion: dto.denominacion,
                    descripcion: dto.descripcion,
                }   
                const planCarrera = await this.servicePlanEstudioCarrera.crearPlanEstudioCarrera(datos, user);
                //console.log("planCarrera:::::::", planCarrera.data.id);
                if(planCarrera?.data.id){
                   // console.log("creoPlanCarrera");
                    let datopc = {
                        plan_estudio_carrera_id:planCarrera.data.id,
                        carrera_autorizada_id:carreraAutorizada.carrera_autorizada_id
                    }
                    await this.serviceInstitutoPlanEstudioCarrera.createInstitutoPlan(datopc, user);
                }

              return planResolucion;
            }
        }
        const crearResult = await this.planEstudioResolucionRepository.runTransaction(op);
        
        console.log("se registra anidado");
        console.log(crearResult);

        if(crearResult){
            //mandamos datos de carrera_autorizada
           /* const datoPlanEstudioCarrera = await this.planEstudioCarreraRepository.findOneResolucionByData( 
              crearResult.data.id,
              carreraAutorizada.carrera_id,
              carreraAutorizada.nivel_academico_tipo_id,
              carreraAutorizada.area_id,
              carreraAutorizada.intervalo_gestion_tipo_id,
              carreraAutorizada.tiempo_estudio);

             console.log("inicio"); 
             console.log(crearResult.data.id);
             console.log(datoPlanEstudioCarrera);
             console.log("finnn");
             */
            let datos = {
               // plan_estudio_resolucion_id: crearResult.data.id,
                carrera_autorizada_id: carreraAutorizada.carrera_autorizada_id,
                carrera_id: carreraAutorizada.carrera_id,
                carrera: carreraAutorizada.carrera,
                area_id: carreraAutorizada.area_id,
                area: carreraAutorizada.area,
                tiempo_estudio: carreraAutorizada.tiempo_estudio,
                carga_horaria: carreraAutorizada.area,
                nivel_academico_tipo_id: carreraAutorizada.nivel_academico_tipo_id,
                nivel_academico: carreraAutorizada.nivel_academico,
                intervalo_gestion_tipo_id: carreraAutorizada.intervalo_gestion_tipo_id,
                regimen_estudio: carreraAutorizada.regimen_estudio,
                plan_estudio_carrera_id: crearResult.data.planEstudioCarreraId,
            }      
          return this._serviceResp.respuestaHttp201(
              datos,
              'Registro de carrera Creado !!',
              '',
          );
        }
        return this._serviceResp.respuestaHttp500(
          "",
          'No se pudo guardar la información !!',
          '',
      );

    }
  async getById(id: number){
      const resolucion = await this.planEstudioResolucionRepository.getOneById(id);
          return resolucion;
  }
    async getCarrerasOfertasById(id: number){
      const resolucion = await this.planEstudioResolucionRepository.findCarrerasByResolucionesId(id);
          return resolucion;
  }

  async editEstadoResolucionCarrera(id: number, ca:number)
  {
      const datoCarreraResolucionInstituto = await this.planEstudioCarreraRepository.findCarreraInstitutoByResolucionId(id, ca);
      console.log(datoCarreraResolucionInstituto);
      if(datoCarreraResolucionInstituto){
        let estado = true;
        if(datoCarreraResolucionInstituto.activo==true){
          estado = false;
        }
        await this.planEstudioResolucionRepository.actualizarEstadoInstitucionResolucion(
          datoCarreraResolucionInstituto.instituto_plan_estudio_carrera_id,
          estado
        );
        return this._serviceResp.respuestaHttp202(
          datoCarreraResolucionInstituto,
          'Se cambio de estado correctamente',
          '',
      );
      }
      return this._serviceResp.respuestaHttp401(
        "",
        'No se pudo actualizar el estado',
        '',
      );        
    }
    async editEstadoResolucion(id: number, ca:number)
    {
      
      const dato = await this.getById(id);
        let estado = true;
      if(dato.activo==true){
        estado = false;
      }
      //buscar si tiene carreras autorizadas
      const listaCarreras = await this.planEstudioCarreraRepository.findCarrerasByResolucionId(id);
      console.log("inicio listaa");
      console.log(listaCarreras);
      console.log("listaa");

      const listaCarrerasInstitutos = await this.planEstudioCarreraRepository.findCarrerasInstitutosByResolucionId(id);

      console.log("inicio listaa 222");
      console.log(listaCarrerasInstitutos);
      console.log("listaa 222");

      if(listaCarrerasInstitutos.length==1){
        let estado = true;
        if(listaCarrerasInstitutos[0].activo==true){
          estado = false;
        }
        const resolucionInstituto = await this.planEstudioResolucionRepository.actualizarEstadoInstitucionResolucion(
          listaCarrerasInstitutos[0].instituto_plan_estudio_carrera_id,
          estado
        );
      }
      
       const resolucion = await this.planEstudioResolucionRepository.actualizarEstadoResolucion(
            id,
            estado
        );
        return this._serviceResp.respuestaHttp202(
          resolucion,
          'Se cambio de estado correctamente',
          '',
      );
    }

    async editDatoResolucion(id: number, dto:CreateResolucionDto)
    {
        
        const res = await this.planEstudioResolucionRepository.updateDatosResolucionById(id,dto);
        if(res){
            console.log("res:", res);
            console.log("Resolucion cambio de estado");
            return this._serviceResp.respuestaHttp202(
            res,
            "Registro Actualizado !!",
            ""
            );
        }
        
        return this._serviceResp.respuestaHttp500(
        "",
        "Error Registro  !!",
        ""
        );
    }

    async deleteResolucion(id: number)
    {
      const carreras = await this.planEstudioResolucionRepository.findCarrerasByResolucionesId(id);

      console.log("inicio carr");
      console.log(carreras);
      console.log("carrr");
      //busqueda de carreras
      const listaCarreras = await this.planEstudioCarreraRepository.findCarrerasByResolucionId(id);

      console.log("inicio listaa");
      console.log(listaCarreras);
      console.log("listaa");
      //busqueda de ofertas
      const listaCarrerasInstitutos = await this.planEstudioCarreraRepository.findCarrerasInstitutosByResolucionId(id);

      console.log("inicio listaa 222");
      console.log(listaCarrerasInstitutos);
      console.log("listaa 222");

      if(listaCarrerasInstitutos.length==1){
        if(listaCarrerasInstitutos[0].oferta_curricular_id){ //si existe una oferta la vamos a eliminar
          //const result =  await this.ofertaCurricularRepository.deleteOferta(id);
          console.log("borrar");
        }

      }
      /*
      if(carreras.length==0){
        const result =  await this.planEstudioResolucionRepository.deleteResolucion(id);

        if (result.affected === 0) {
            throw new NotFoundException("registro no encontrado !");
          }
          return this._serviceResp.respuestaHttp203(
            result,
            "Registro Eliminado !!",
            ""
          );
        }
        return this._serviceResp.respuestaHttp500(
          "",
          "No se puede eliminar los datos existen ofertas curriculares asignadas !!",
          ""
        );
      }*/
    }
    async deleteResolucionCarrera(id: number, ca:number)
    {
      const institutoResolucionCarrera = await this.institutoPlanEstudioCarreraRepository.findCarreraAutorizadaResolucion(id,ca);
      console.log("irec", institutoResolucionCarrera);
      //borramos la asignación siempre y cuando no tenga ofertas
      if(!institutoResolucionCarrera){
        return this._serviceResp.respuestaHttp203(
          "",
          "No existe la asignacion de resolucion !!",
          ""
        );
      }
      if(institutoResolucionCarrera.id 
        && institutoResolucionCarrera.ofertasCurriculares.length==0
        && institutoResolucionCarrera.matriculasEstudiantes.length==0
        ){
          const result = await this.institutoPlanEstudioCarreraRepository.deleteAsignacion(institutoResolucionCarrera.id);
          console.log("resultado",result);
          if (result.affected === 0) {
            throw new NotFoundException("registro no encontrado !");
          }
          
          return this._serviceResp.respuestaHttp203(
            result,
            "Registro Eliminado !!",
            ""
          );
      }
      if(institutoResolucionCarrera.ofertasCurriculares.length>0){
        return this._serviceResp.respuestaHttp500(
          "",
          "No se puede eliminar los datos existen ofertas curriculares asignadas !!",
          ""
        );
      }
     
    }
}
