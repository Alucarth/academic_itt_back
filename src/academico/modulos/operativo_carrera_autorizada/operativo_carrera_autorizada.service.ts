import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { User } from 'src/users/entity/users.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateOperativoCarreraAutorizadaDto } from './dto/createOperativoCarreraAutorizada.dto';
import { UpdateOperativoCarreraAutorizadaDto } from './dto/updateOperativoCarreraAutorizada.dto';
import { OperativoCarreraAutorizadaRepository } from './operativo_carrera_autorizada.repository';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { UpdateFechaOperativoCarreraAutorizadaDto } from './dto/updateFechaOperativoCarreraAutorizada.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
@Injectable()
export class OperativoCarreraAutorizadaService {
    constructor(
        @Inject(OperativoCarreraAutorizadaRepository)
        private operativoCarreraAutorizadaRepositorio: OperativoCarreraAutorizadaRepository,
        @InjectRepository(OperativoCarreraAutorizada)
        private _operativeCareerRepository: Repository< OperativoCarreraAutorizada>,

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
   

}
