import { Operativo } from './../../entidades/operativo.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { User } from 'src/users/entity/users.entity';
import { EntityManager, Repository } from 'typeorm';

import { UpdateOperativoCarreraAutorizadaDto } from './dto/updateOperativoCarreraAutorizada.dto';
import { OperativoCarreraAutorizadaRepository } from './operativo_carrera_autorizada.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { UpdateFechaOperativoCarreraAutorizadaDto } from './dto/updateFechaOperativoCarreraAutorizada.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { PeriodoTipo } from 'src/academico/entidades/periodoTipo.entity';
import { ModalidadEvaluacionTipo } from 'src/academico/entidades/modalidadEvaluacionTipo.entity';
import { EventoTipo } from 'src/academico/entidades/eventoTipo.entity';
import { CreateOperativoCarreraAutorizadaDto } from './dto/createOperativoCarreraAutorizada.dto';
import { OperativoCarreraAutorizadaDTO } from './dto/OperativoCarreraAutorizada.dto';
@Injectable()
export class OperativoCarreraAutorizadaService {
    constructor(
        @Inject(OperativoCarreraAutorizadaRepository)
        private operativoCarreraAutorizadaRepositorio: OperativoCarreraAutorizadaRepository,
        @InjectRepository(OperativoCarreraAutorizada)
        private _operativeCareerRepository: Repository< OperativoCarreraAutorizada>,
        @InjectRepository(CarreraAutorizadaResolucion)
        private _carreraAutorizadaResolucionRepository: Repository<CarreraAutorizadaResolucion>,
        @InjectRepository(PeriodoTipo)
        private _periodoTipoRepository: Repository <PeriodoTipo>,
        @InjectRepository(EventoTipo)
        private _eventoTipoRepository: Repository <EventoTipo>,
        @InjectRepository(ModalidadEvaluacionTipo)
        private _modalidadEvaluacionTipoRepository: Repository<ModalidadEvaluacionTipo>,
        private _serviceResp: RespuestaSigedService,
    ){}
    
    

    async findAllOperativos(){
        return await this.operativoCarreraAutorizadaRepositorio.getAll();
    }
    async findOperativoCarrera(id:number){
        const operativo = await this.operativoCarreraAutorizadaRepositorio.getDatoOperativoCarrera(id);
          return this._serviceResp.respuestaHttp201(
                operativo,
                'Existen resultados encontrados !!',
                '',
            );
        
    }
    async findAllOperativosCarrera(id:number){
        const operativos = await this.operativoCarreraAutorizadaRepositorio.getAllOperativosCarrera(id);
        if(operativos.length > 0){
            return this._serviceResp.respuestaHttp201(
                operativos,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );
    }
    async findOperativoActivoCarrera(id:number){
        const operativo = await this.operativoCarreraAutorizadaRepositorio.getOperativoVigenteCarrera(id);
        if(operativo){
            return this._serviceResp.respuestaHttp201(
                operativo,
                'Existen resultados encontrados !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp404(
            "",
            'No se encontraron resultados!!',
            '',
        );

    }
    
    async getById(id: number){
        const operativo = await this.operativoCarreraAutorizadaRepositorio.getOneById(id);
            return operativo;
    }

    async getByDato(dto: CreateOperativoCarreraAutorizadaDto){
        const operativo = await this.operativoCarreraAutorizadaRepositorio.getOneByDato(dto);
            return operativo;
    }
    async editEstado(carreraId: number, gestionId:number)
    {
        const operativo = await this.operativoCarreraAutorizadaRepositorio.actualizarEstado(
            carreraId,
            gestionId
        );
        return operativo;

    }

    async createOperativoCarrera (dto: CreateOperativoCarreraAutorizadaDto, user:UserEntity) {
        //actualizacion de todos los esatados  a falso
       const estado = await this.editEstado(dto.carrera_autorizada_id, dto.gestion_tipo_id);

       const operativo = await this.getByDato(dto);

       if(!operativo){
            const op = async (transaction: EntityManager) => {
            const nuevoOperativo =  await this.operativoCarreraAutorizadaRepositorio.createOperativoCarrera(
                user.id,
                dto,
                transaction
              );
              return nuevoOperativo;
            }
  
            const crearResult = await this.operativoCarreraAutorizadaRepositorio.runTransaction(op)
  
            if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  crearResult.id,
                  'Registro de operativo Creado !!',
                  '',
              );
            }else{
               
                    return this._serviceResp.respuestaHttp500(
                      "",
                      'Se produjo un error !!',
                      '',
                  );
            }
        }
        else{
            return this._serviceResp.respuestaHttp409(
              operativo,
              'El registro ya existe !!',
              '',
          );
        }
    }
   
    async editOperativoCarreraById(id: number, dto:UpdateOperativoCarreraAutorizadaDto)
    {
        const dato = await this.getById(id);

         await this.editEstado( 
            dato.carreraAutorizadaId, 
            dato.gestionTipoId
            );

        const res = await this.operativoCarreraAutorizadaRepositorio.updateOperativoCarreraById(id,dto);
        if(res){
            console.log("res:", res);
            console.log("Operativo cambio de estado");
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
    async editFechaOperativoCarreraById(id: number, dto:UpdateFechaOperativoCarreraAutorizadaDto)
    {
        const res = await this.operativoCarreraAutorizadaRepositorio.updateFechaOperativoCarreraById(id,dto);
        if(res){
            console.log("res:", res);
            console.log("Operativo cambio de fecha");
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


    async editEstadoById(id: number)
    {
        //obntenemos el dato deloperativo
        const dato = await this.operativoCarreraAutorizadaRepositorio.getOneById(id);
        console.log('datao======********=======:',dato);
        let estado = true;
       
        // if(dato.activo==false){
        //     estado = true;
        // }
        console.log('estado', estado)
        const actualiza = await this.operativoCarreraAutorizadaRepositorio.actualizarEstado(
            dato.carreraAutorizadaId,
            dato.gestionTipoId);
        const lista = await this.findAllOperativosCarrera(38)
        console.log('verificando lista',lista)
        console.log('actualiza:', actualiza);
        if (actualiza.affected > 0) {
            const res = await this.operativoCarreraAutorizadaRepositorio.actualizarEstadoById(id, estado);
            console.log('resultado', res)
            if (res) {
                console.log("res:", res);
                console.log("Operativo cambio de estado");
                return this._serviceResp.respuestaHttp202(
                    res,
                    "Registro Actualizado !!",
                    ""
                );
            }
        }

        return this._serviceResp.respuestaHttp500(
        "",
        "Error Registro  !!",
        ""
        );
    }
    
    async deleteOperativoCarrera(id: number)
    {
        const result =  await this.operativoCarreraAutorizadaRepositorio.deleteCarreraOperativo(id);

        if (result.affected === 0) {
            throw new NotFoundException("registro no encontrado !");
          }
      
          return this._serviceResp.respuestaHttp203(
            result,
            "Registro Eliminado !!",
            ""
          );
    }

    async getOperativeActive(carrera_autorizada_id){
        const operative = await this._operativeCareerRepository.findOne({
            relations:{
                periodoTipo: true,
                eventoTipo: true,
                modalidadEvaluacionTipo:true,
                gestionTipo: true,
            },
            where: {
                carreraAutorizadaId: carrera_autorizada_id, activo: true
            },
        })
        return operative
    }

    async operativeCareer( carrera_autorizada_id, gestion_id, periodo_tipo_id)
    {
        const operatives = await this._operativeCareerRepository.find({
            relations:{
                periodoTipo: true,
                eventoTipo: true,
                modalidadEvaluacionTipo:true
            },
            where: {
                carreraAutorizadaId: carrera_autorizada_id, gestionTipoId: gestion_id , periodoTipoId: periodo_tipo_id
            },
            order:{ id: 'asc'}
        })
        return operatives
    }
    /**
     * intervalo_gestion_tipo_id: 4 Anual 1 Semestral
     * evento_tipo_id: 1 inscripciones 2 calificaciones
     * modalidad_evaluacion_tipo_id: 
     * 1 primer trimestre
     * 2 segundo trimestre
     * 3 primer bimestre
     * 4 segundo bimestre
     * 5 ter bimestre
     * 6 cuarto bimestre
     * 7 nota final
     * 9 recuperatorio
     */
    async generateOperativesCareer(carrera_autorizada_id, gestion_id, user)
    {
        const carrera_autorizada_resolucion = await this._carreraAutorizadaResolucionRepository.findOneBy({carreraAutorizadaId: carrera_autorizada_id, ultimo: true } )
        
        if(carrera_autorizada_resolucion)
        {
            const periodos = await this._periodoTipoRepository.find({
                where: {intervaloGestionTipoId: carrera_autorizada_resolucion.intervaloGestionTipoId}
            })

            const modalidades = await this._modalidadEvaluacionTipoRepository.find({
                where: { intervaloGestionTipoId: carrera_autorizada_resolucion.intervaloGestionTipoId}
            })

            const eventos = await this._eventoTipoRepository.find()
            
            let operativo_activo = false
            
            await Promise.all(periodos.map(async (periodo)=>{

                await Promise.all(eventos.map( async (evento)=>{

                    if(evento.evento === 'Inscripciones')
                    {
                        let new_operativo = new OperativoCarreraAutorizadaDTO()
                        new_operativo.carreraAutorizadaId = carrera_autorizada_id
                        new_operativo.eventoTipoId = evento.id
                        new_operativo.gestionTipoId = gestion_id
                        new_operativo.periodoTipoId = periodo.id
                        new_operativo.activo = false

                        let operativo = await this._operativeCareerRepository.findOne({
                            where:  { 
                                        carreraAutorizadaId: new_operativo.carreraAutorizadaId,
                                        eventoTipoId: new_operativo.eventoTipoId,
                                        gestionTipoId: new_operativo.gestionTipoId,
                                        periodoTipoId: new_operativo.periodoTipoId
                                    }
                        })

                        if(!operativo){
                            if(!operativo_activo){
                            //    new_operativo.activo = true //por defecto todo aparecera innahibilitado
                               operativo_activo = true
                            }
                            await this._operativeCareerRepository.save(new_operativo) 
                            
                        }
                        // new_operativo.user_id = user.id
                    }

                    if(evento.evento === 'Calificaciones')
                    {
                        await Promise.all( modalidades.map( async (modalidad)=>{
                            
                            let new_operativo = new OperativoCarreraAutorizadaDTO()
                            new_operativo.carreraAutorizadaId = carrera_autorizada_id
                            new_operativo.eventoTipoId = evento.id
                            new_operativo.gestionTipoId = gestion_id
                            new_operativo.periodoTipoId = periodo.id
                            new_operativo.activo = false
                            new_operativo.modalidadEvaluacionTipoId = modalidad.id

                            let operativo = await this._operativeCareerRepository.findOne({
                                where:  { 
                                            carreraAutorizadaId: new_operativo.carreraAutorizadaId,
                                            eventoTipoId: new_operativo.eventoTipoId,
                                            gestionTipoId: new_operativo.gestionTipoId,
                                            periodoTipoId: new_operativo.periodoTipoId,
                                            modalidadEvaluacionTipoId : new_operativo.modalidadEvaluacionTipoId
                                        }
                            })

                            if(!operativo){
                                await this._operativeCareerRepository.save(new_operativo)
                            }

                        }))

                         // adicionando modalidad recuperatorio 

                        let new_operativo = new OperativoCarreraAutorizadaDTO()
                        new_operativo.carreraAutorizadaId = carrera_autorizada_id
                        new_operativo.eventoTipoId = evento.id
                        new_operativo.gestionTipoId = gestion_id
                        new_operativo.periodoTipoId = periodo.id
                        new_operativo.activo = false
                        new_operativo.modalidadEvaluacionTipoId = 9

                        let operativo = await this._operativeCareerRepository.findOne({
                            where:  { 
                                        carreraAutorizadaId: new_operativo.carreraAutorizadaId,
                                        eventoTipoId: new_operativo.eventoTipoId,
                                        gestionTipoId: new_operativo.gestionTipoId,
                                        periodoTipoId: new_operativo.periodoTipoId,
                                        modalidadEvaluacionTipoId : new_operativo.modalidadEvaluacionTipoId
                                    }
                        })

                        if(!operativo){
                            await this._operativeCareerRepository.save(new_operativo)
                        }
                        new_operativo = null
                        operativo = null
                        // adicionando modalidad final

                        new_operativo = new OperativoCarreraAutorizadaDTO()
                        new_operativo.carreraAutorizadaId = carrera_autorizada_id
                        new_operativo.eventoTipoId = evento.id
                        new_operativo.gestionTipoId = gestion_id
                        new_operativo.periodoTipoId = periodo.id
                        new_operativo.activo = false
                        new_operativo.modalidadEvaluacionTipoId = 7
    
                        operativo = await this._operativeCareerRepository.findOne({
                            where:  { 
                                        carreraAutorizadaId: new_operativo.carreraAutorizadaId,
                                        eventoTipoId: new_operativo.eventoTipoId,
                                        gestionTipoId: new_operativo.gestionTipoId,
                                        periodoTipoId: new_operativo.periodoTipoId,
                                        modalidadEvaluacionTipoId : new_operativo.modalidadEvaluacionTipoId
                                    }
                        })
    
                        if(!operativo){
                            await this._operativeCareerRepository.save(new_operativo)
                        }

                    }                   
                    
                }))

            }))
        }

        const operativos = await this._operativeCareerRepository.find({
            where:{ carreraAutorizadaId: carrera_autorizada_id }
        })

        return operativos
    }

    async generateExcepconalRecovery(periodo_tipo_id, gestion_tipo_id, carrera_autorizada_id, user)
    {   
        
        let operativo = await this._operativeCareerRepository.findOne({
            where:  { 
                        carreraAutorizadaId: carrera_autorizada_id,
                        eventoTipoId: 2, //calificaciones
                        gestionTipoId: gestion_tipo_id,
                        periodoTipoId: periodo_tipo_id,
                        modalidadEvaluacionTipoId : 10 
                    }
        })

        if(!operativo){
            const new_operativo = new OperativoCarreraAutorizadaDTO()
            new_operativo.carreraAutorizadaId = carrera_autorizada_id
            new_operativo.eventoTipoId = 2
            new_operativo.gestionTipoId = gestion_tipo_id
            new_operativo.periodoTipoId = periodo_tipo_id
            new_operativo.activo = false
            new_operativo.modalidadEvaluacionTipoId = 10
           operativo =  await this._operativeCareerRepository.save(new_operativo)
        }
       
        // adicionando modalidad final

        return operativo

    }

}
