import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { CarreraAutorizadaResolucionRepository } from './carrera_autorizada_resolucion.repository';
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { UpdateCarreraAutorizadaResolucionDTO } from './dto/UpdateCarreraAutorizadaResolucionDTO.dto';
@Injectable()
export class CarreraAutorizadaResolucionService {
    constructor(
        @Inject(CarreraAutorizadaResolucionRepository)
        private carreraAutorizadaResolucionRepositorio: CarreraAutorizadaResolucionRepository,
        @Inject(CarreraAutorizadaRepository)
        private carreraAutorizadaRepositorio: CarreraAutorizadaRepository,
        @InjectRepository(CarreraAutorizada)
        private _carreraAutorizadaRepository: Repository<CarreraAutorizada>,
        @InjectRepository(CarreraAutorizadaResolucion)
        private _carreraAutorizadaResolucionRepository: Repository<CarreraAutorizadaResolucion>,
        private _serviceResp: RespuestaSigedService, 

      
        //private _serviceResp: RespuestaSigedService
      ) {}
      async getOneById(id: number) {
        const carrera = await this.carreraAutorizadaResolucionRepositorio.getOneBy(id);
        return carrera;
      }
      async getAll(id: number) {
        const carrera = await this.carreraAutorizadaResolucionRepositorio.getAll();
        return carrera;
      }

      async crear(dto: CreateCarreraAutorizadaResolucionDto, user:UserEntity) {
        // verificar la carrera ya existe
        console.log('DTO', dto)
        const carrera_resolucion = await this.carreraAutorizadaResolucionRepositorio.getDatoCarreraAutorizadaResolucion(dto);
        console.log("carrera:::::::::::::::::::::",carrera_resolucion);
        if(carrera_resolucion){
          return this._serviceResp.respuestaHttp500(
            "",
            'Ya existe la carrera no puede guardar la información !!',
            '',
          );
        }
    
        const op = async (transaction: EntityManager) => {
            const nuevaCarreraAutorizada = await this.carreraAutorizadaRepositorio.createAutorizada(
              user.id,
              dto, 
              transaction);
            if(nuevaCarreraAutorizada?.id){
                await this.carreraAutorizadaResolucionRepositorio.crearCarreraResolucion(
                  user.id, 
                  nuevaCarreraAutorizada?.id, 
                  dto,
                  transaction
              );
              return nuevaCarreraAutorizada
            }
        }
        const crearResult = await this.carreraAutorizadaResolucionRepositorio.runTransaction(op);
    
        if(crearResult){
          return this._serviceResp.respuestaHttp201(
              crearResult.id,
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

      async showCareer(carrera_autorizada_id)
      {
        const carrera_autorizada = this._carreraAutorizadaRepository.findOne({
          relations:{
            areaTipo: true,
            carreraTipo: true,
            institucionEducativaSucursal: true,
            resoluciones: {
              resolucionTipo: true,
              intervaloGestionTipo: true,
              nivelAcademicoTipo: true,
            }
          },
          where: { id: carrera_autorizada_id}
        })
        return carrera_autorizada
      }

      async editResolutionCareer(carrera_autorizada_resolucion_id, payload: UpdateCarreraAutorizadaResolucionDTO, user: UserEntity)
      {
        const carrera_autorizada_resolucion = await this._carreraAutorizadaResolucionRepository.findOne({ where: { id: carrera_autorizada_resolucion_id} })

        carrera_autorizada_resolucion.fechaResolucion = payload.fechaResolucion
        carrera_autorizada_resolucion.resolucionTipoId = payload.resolucionTipoId
        carrera_autorizada_resolucion.numeroResolucion = payload.numeroResolucion
        carrera_autorizada_resolucion.nivelAcademicoTipoId = payload.nivelAcademicoTipoId
        carrera_autorizada_resolucion.intervaloGestionTipoId = payload.intervaloGestionTipoId
        carrera_autorizada_resolucion.tiempoEstudio = payload.tiempoEstudio
        carrera_autorizada_resolucion.cargaHoraria = payload.cargaHoraria
        carrera_autorizada_resolucion.usuarioId = user.id

        return await this._carreraAutorizadaResolucionRepository.save(carrera_autorizada_resolucion)
        
      }

      async createResolutionCareer(payload: UpdateCarreraAutorizadaResolucionDTO, user: UserEntity)
      {
        console.log('payload', payload)
        payload.usuarioId = user.id
        // payload.ultimo = false
        let resolution = await this._carreraAutorizadaResolucionRepository.save(payload)
        // console.log(resolution)
        // if(resolution.ultimo !== payload.ultimo)
        // {
        //   let new_resolution = await this.changeState(resolution.id, payload.ultimo)
        //   return new_resolution
        // } 
        return resolution
      }
      
      async changeState (carrera_autorizada_resolucion_id: number, ultimo: boolean)
      {
        console.log('cambiando de estado',ultimo )
        const resolution = await this._carreraAutorizadaResolucionRepository.findOne({
          where:{id: carrera_autorizada_resolucion_id}
        })
        
        resolution.ultimo = ultimo
        console.log('resolution', resolution)
        return await this._carreraAutorizadaResolucionRepository.save(resolution)
      }

      async deleteResolutionCareer(carrera_autorizada_resolucion_id)
      {
        return await this._carreraAutorizadaResolucionRepository.delete(carrera_autorizada_resolucion_id)
      }
      
      async getCareerResolutionsInstitute(institucion_educativa_sucursal_id)
      {
        return await this._carreraAutorizadaResolucionRepository.find({
          relations:{ 
            carreraAutorizada: true,
            nivelAcademicoTipo: true,
            intervaloGestionTipo: true ,
            resolucionTipo:true
          },
          where: { carreraAutorizada: {institucionEducativaSucursalId: institucion_educativa_sucursal_id } }
        })
      }

    }
