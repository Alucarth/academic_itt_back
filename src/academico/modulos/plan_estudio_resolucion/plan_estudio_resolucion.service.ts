import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { InstitutoPlanEstudioCarreraRepository } from '../instituto_plan_estudio_carrera/instituto_plan_estudio_carrera.repository';
import { InstitutoPlanEstudioCarreraService } from '../instituto_plan_estudio_carrera/instituto_plan_estudio_carrera.service';
import { PlanEstudioCarreraRepository } from '../plan_estudio_carrera/plan_estudio_carrera.repository';
import { PlanEstudioCarreraService } from '../plan_estudio_carrera/plan_estudio_carrera.service';
import { CreatePlanEstudioResolucionDto } from './dto/createPlanEstudioResolucion.dto';
import { CreateResolucionDto } from './dto/createResolucion.dto';
import { PlanEstudioResolucionRepository } from './plan_estudio_resolucion.repository';

@Injectable()
export class PlanEstudioResolucionService {
    constructor(
        
        @Inject(PlanEstudioResolucionRepository) 
        private planEstudioResolucionRepository: PlanEstudioResolucionRepository,

        @Inject(CarreraAutorizadaRepository) 
        private carreraAutorizadaRepository: CarreraAutorizadaRepository,

        @Inject(PlanEstudioCarreraRepository) 
        private planEstudioCarreraRepository: PlanEstudioCarreraRepository,
       
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
    async getAll(){
        const cursos = await this.planEstudioResolucionRepository.getAll()
        return cursos
    }
    async createNewResolucion(dto: CreateResolucionDto) {
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
                1,
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


    async crear(dto: CreatePlanEstudioResolucionDto) {
        
        // verificar la carrera ya existe
    const carreraAutorizada =await this.carreraAutorizadaRepository.getCarreraAutorizadaById(dto.carrera_autorizada_id);
    
        const op = async (transaction: EntityManager) => {

            const planResolucion = await this.createNewResolucion(dto);
            if(planResolucion.data?.id){ 
                console.log("creoResol");
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
                }   
                const planCarrera = await this.servicePlanEstudioCarrera.crearPlanEstudioCarrera(datos);
                
                if(planCarrera?.data.id ){
                    console.log("creoPlanCarrera");
                    let datopc = {
                        plan_estudio_carrera_id:planCarrera.data.id,
                        carrera_autorizada_id:carreraAutorizada.carrera_autorizada_id
                    }
                    await this.serviceInstitutoPlanEstudioCarrera.createInstitutoPlan(datopc);
                }

              return planResolucion;
            }
        }
        const crearResult = await this.planEstudioResolucionRepository.runTransaction(op);
        
        if(crearResult){
            //mandamos datos de carrera_autorizada
            let datos = {
                plan_estudio_resolucion_id: crearResult.data.id,
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
    async editEstadoResolucion(id: number)
    {
      const dato = await this.getById(id);
        let estado = true;
      if(dato.activo==true){
        estado = false;
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
    }
}
