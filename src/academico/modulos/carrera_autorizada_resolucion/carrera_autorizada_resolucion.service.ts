import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CarreraAutorizadaRepository } from '../carrera_autorizada/carrera_autorizada.repository';
import { CarreraAutorizadaResolucionRepository } from './carrera_autorizada_resolucion.repository';
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';
import { User as UserEntity } from 'src/users/entity/users.entity';
@Injectable()
export class CarreraAutorizadaResolucionService {
    constructor(
        @Inject(CarreraAutorizadaResolucionRepository)
        private carreraAutorizadaResolucionRepositorio: CarreraAutorizadaResolucionRepository,
        @Inject(CarreraAutorizadaRepository)
        private carreraAutorizadaRepositorio: CarreraAutorizadaRepository,
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
       /* if(carrera_resolucion){
          return carrera_resolucion;
        }*/
    
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
    }
