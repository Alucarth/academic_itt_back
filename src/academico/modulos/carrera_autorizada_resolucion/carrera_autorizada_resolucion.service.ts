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

      async editResolutionCareer(carrera_autorizada_resolucion_id, payload: UpdateCarreraAutorizadaResolucionDTO)
      {
        const carrera_autorizada_resolucion = await this._carreraAutorizadaResolucionRepository.findOne({ where: { id: carrera_autorizada_resolucion_id} })

        carrera_autorizada_resolucion.fechaResolucion = payload.fechaResolucion
        carrera_autorizada_resolucion.resolucionTipoId = payload.resolucionTipoId
        carrera_autorizada_resolucion.numeroResolucion = payload.numeroResolucion
        carrera_autorizada_resolucion.nivelAcademicoTipoId = payload.nivelAcademicoTipoId
        carrera_autorizada_resolucion.intervaloGestionTipoId = payload.intervaloGestionTipoId
        carrera_autorizada_resolucion.tiempoEstudio = payload.tiempoEstudio
        carrera_autorizada_resolucion.cargaHoraria = payload.cargaHoraria

        return await this._carreraAutorizadaResolucionRepository.save(carrera_autorizada_resolucion)
        
      }

    

    }
