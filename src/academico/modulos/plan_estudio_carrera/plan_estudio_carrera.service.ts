import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { CreatePlanEstudioCarreraDto, UpdatePlanEstudioCarreraDto } from './dto/createPlanEstudioCarrera.dto';
import { PlanEstudioCarreraRepository } from './plan_estudio_carrera.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEstudioCarrera } from 'src/academico/entidades/planEstudioCarrera.entity';
@Injectable()
export class PlanEstudioCarreraService {
    constructor(
        
        @Inject(PlanEstudioCarreraRepository) 
        private planEstudioCarreraRepository: PlanEstudioCarreraRepository,
        @InjectRepository(PlanEstudioCarrera)
        private _planEstudioCarreraRepository: Repository<PlanEstudioCarrera>,
        
        @Inject(CarreraAutorizadaRepository) 
        private carreraAutorizadaRepository: CarreraAutorizadaRepository,
         
        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getResolucionesAll(){
        const carreras = await this.planEstudioCarreraRepository.getResolucionesAll()
        return carreras
    }
    async getCarrerasResolucionId(id:number){
        const carreras = await this.planEstudioCarreraRepository.findCarrerasByResolucionId(id)
        return carreras
    }
    async getPlanesCarreraById(id:number){
        
        const carrera = await this.planEstudioCarreraRepository.findCarreraById(id)
        
        return carrera
    }
    async getPlanAsignaturaCarreraById( id:number ){
        const result = await this.planEstudioCarreraRepository.findResolucionCarreraAsignaturas(id);
        return result;    
     }

    async getResolucionesByData(
        carrera_id:number,
        nivel_id:number,
        area_id:number,
        intervalo_id:number,
        tiempo:number,
        carga:number
        ){
        
        const carrera = await this.planEstudioCarreraRepository.findResolucionesByData(
            carrera_id,
            nivel_id,
            area_id,
            intervalo_id,
            tiempo,
            carga)
        return carrera
    }
    async getByResolucionData(
        resolucion_id:number,
        carrera_id:number,
        nivel_id:number,
        area_id:number,
        intervalo_id:number,
        tiempo:number){
        
        const carrera = await this.planEstudioCarreraRepository.findOneResolucionByData(
            resolucion_id,
            carrera_id,
            nivel_id,
            area_id,
            intervalo_id,
            tiempo)
        return carrera
    }

    async getResolucionesByCarreraId(id:number){
        console.log('id',id)
        const carreraAutorizada = await this.carreraAutorizadaRepository.getCarreraAutorizadaById(id);
        console.log('carrera autorizada',carreraAutorizada)
        if(carreraAutorizada){
            const resoluciones = await this.planEstudioCarreraRepository.findResolucionesByData(
                carreraAutorizada.carrera_id,
                carreraAutorizada.nivel_academico_tipo_id,
                carreraAutorizada.area_id,
                carreraAutorizada.intervalo_gestion_tipo_id,
                carreraAutorizada.tiempo_estudio,
                carreraAutorizada.carga_horaria,
            )
            console.log("------------");
            console.log(resoluciones);
            if(resoluciones.length>0){
                return this._serviceResp.respuestaHttp201(
                    resoluciones,
                    "Registro Encontrado !!",
                    ""
                );
            }
            else{
                return this._serviceResp.respuestaHttp404(
                    '',
                    "No existen resoluciones de planes de estudio !!",
                    ""
                  );
            }
        }
        
        return this._serviceResp.respuestaHttp404(
            '',
            "Se produjo un error !!",
            ""
          );
    }
    async getResolucionesByCarreraAutorizadaId(id:number){
        
        const carreraAutorizada = await this.carreraAutorizadaRepository.getCarreraAutorizadaById(id);

        if(carreraAutorizada){
            const resoluciones = await this.planEstudioCarreraRepository.findResolucionesByCarreraAutorizadaData(
                carreraAutorizada.carrera_id,
                carreraAutorizada.nivel_academico_tipo_id,
                carreraAutorizada.area_id,
                carreraAutorizada.intervalo_gestion_tipo_id,
                carreraAutorizada.tiempo_estudio
            )
            console.log("------------");
            console.log(resoluciones);
            if(resoluciones.length>0){
                return this._serviceResp.respuestaHttp201(
                    resoluciones,
                    "Registro Encontrado !!",
                    ""
                );
            }
            else{
                return this._serviceResp.respuestaHttp404(
                    '',
                    "No existen resoluciones de planes de estudio !!",
                    ""
                  );
            }
        }
        
        return this._serviceResp.respuestaHttp404(
            '',
            "Se produjo un error !!",
            ""
          );
    }

    async crearPlanEstudioCarrera(dto: CreatePlanEstudioCarreraDto, user:UserEntity) {
        //1:BUSCAR resolucion
        const dato = await this.getByResolucionData( 
            dto.plan_estudio_resolucion_id,
            dto.carrera_tipo_id,
            dto.nivel_academico_tipo_id,
            dto.area_tipo_id,
            dto.intervalo_gestion_tipo_id,
            dto.tiempo_estudio);
       
          console.log("plan de carrera : ", dato);
          if (dato) {
            return this._serviceResp.respuestaHttp409(
                dato,
                'Registro ya existe !!',
                '',
              );
          }

        const op = async (transaction: EntityManager) => {
            return await this.planEstudioCarreraRepository.crearPlanCarrera(
                user.id,
                dto,
                transaction
              )
        }
        const crearResult = await this.planEstudioCarreraRepository.runTransaction(op);
        
        console.log(crearResult);

        if(crearResult){
          return this._serviceResp.respuestaHttp201(
            crearResult,
              'Registro  Creado !!',
              '',
          );
        }
        return this._serviceResp.respuestaHttp500(
          "",
          'No se pudo guardar la información !!',
          '',
      );
    }

    async upadtePlanEstudioCarrera(id: number, dto: UpdatePlanEstudioCarreraDto)
    {
        const plan_estudio_carrera = await this._planEstudioCarreraRepository.findOneBy({ id: id})
        plan_estudio_carrera.denominacion = dto.denominacion
        plan_estudio_carrera.descripcion = dto.descripcion
        const plan_estudio_carrera_edited =  await this._planEstudioCarreraRepository.save(plan_estudio_carrera);

        if(plan_estudio_carrera_edited){
            return this._serviceResp.respuestaHttp201(
                plan_estudio_carrera_edited,
                  'Registro  Creado !!',
                  '',
              );
        }
        return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo actualizar el registro !!',
            '',
        );
    }

    async getPlanEstudioCarrera(plan_estudio_carrera_id)
    {
        const regimenes_grado = await this._planEstudioCarreraRepository.query(`
            select rgt.id, rgt.regimen_grado from plan_estudio_asignatura pea
            inner join regimen_grado_tipo rgt on rgt.id = pea.regimen_grado_tipo_id 
            where pea.plan_estudio_carrera_id = ${plan_estudio_carrera_id} group by rgt.id, rgt.regimen_grado;
        `)

        await Promise.all( regimenes_grado.map(async (regimen: any)=>{
            let subjects = await this._planEstudioCarreraRepository.query(`
                select pea.id,  at2.abreviacion  ,at2.asignatura, pea.horas, pea."index" ,
                    (select at3.abreviacion as pre_requisito  from plan_estudio_asignatura_regla pear 
                        inner join plan_estudio_asignatura pea2 on pea2.id = pear.anterior_plan_estudio_asignatura_id  
                        inner join asignatura_tipo at3 on at3.id = pea2.asignatura_tipo_id 
                            where pear.plan_estudio_asignatura_id = pea.id )
                from plan_estudio_asignatura pea 
                inner join asignatura_tipo at2 on at2.id = pea.asignatura_tipo_id 
                where pea.plan_estudio_carrera_id = ${plan_estudio_carrera_id} and pea.regimen_grado_tipo_id = ${regimen.id} order by pea."index" ;
            `)
            regimen.subjects = subjects
        }))

        return regimenes_grado
    }
}
