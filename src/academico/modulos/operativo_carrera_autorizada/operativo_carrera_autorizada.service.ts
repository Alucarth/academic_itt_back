import { Inject, Injectable } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager } from 'typeorm';
import { CreateOperativoCarreraAutorizadaDto } from './dto/createOperativoCarreraAutorizada.dto';
import { OperativoCarreraAutorizadaRepository } from './operativo_carrera_autorizada.repository';

@Injectable()
export class OperativoCarreraAutorizadaService {
    constructor(
        @Inject(OperativoCarreraAutorizadaRepository)
        private operativoCarreraAutorizadaRepositorio: OperativoCarreraAutorizadaRepository,

        private _serviceResp: RespuestaSigedService,
    ){}
    
    

    async findAllOperativos(){
        return await this.operativoCarreraAutorizadaRepositorio.getAll();
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
    
    async createOperativoCarrera (dto: CreateOperativoCarreraAutorizadaDto) {
       
            const op = async (transaction: EntityManager) => {
              
              const nuevoOperativo =  await this.operativoCarreraAutorizadaRepositorio.createOperativoCarrera(
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
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
    }
    /*
    async editOne(id: number, dto: CreatePersonaDto){
        const persona = await this.getById(id);
        persona.nroDocumento = dto.nroDocumento;
        persona.nombres = dto.nombres;
        persona.paterno = dto.paterno;
        persona.materno = dto.materno;
        persona.telefono = dto.telefono;
        persona.direccion = dto.direccion;
        persona.generoId = dto.generoId;
        persona.nacionalidadId = dto.nacionalidadId;
        persona.tipoDocumentoId = dto.tipoDocumentoId;
        return await this.personaRepository.save(persona);

    }*/
    async getById(id: number){
        const operativo = await this.operativoCarreraAutorizadaRepositorio.getOneById(id);
            return operativo;
        
        
    }
    async editEstado(id: number)
    {
        const dato = await this.getById(id);
        let status = false;
        if(dato.activo == false){
            status = true;
        }
        const res = await this.operativoCarreraAutorizadaRepositorio.actualizarEstado(
            id,
            dato.carreraAutorizadaId, 
            dato.gestionTipoId, 
            status)
        if(res){
            console.log("res:", res);
            console.log("Maestro Inscripcion actualizado");
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
}
