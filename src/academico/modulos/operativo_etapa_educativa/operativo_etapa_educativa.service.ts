import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OperativoEtapaEducativa } from 'src/academico/entidades/operativoEtapaEducativa.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { Repository } from 'typeorm';
import { CreateOperativoEtapaEducativaDto } from './dto/createOperativoEtapaEducatvia.dto';

@Injectable()
export class OperativoEtapaEducativaService {

    constructor(
        @InjectRepository(OperativoEtapaEducativa)private operativoEtapaEducativaRepository: Repository<OperativoEtapaEducativa>,
        private _serviceResp: RespuestaSigedService, 
    ){}
    async getAll(){
        const cursos = await this.operativoEtapaEducativaRepository.find()
        return cursos
    }
    async getById( id : number){
         const operativoEtapa = await this.operativoEtapaEducativaRepository.findOneBy( {id: id} );
         return operativoEtapa;
        
    }
    async getByEtapaEducativaId( id : number){
        const operativoEtapa = await this.operativoEtapaEducativaRepository
        .createQueryBuilder("a")
        .innerJoinAndSelect("a.periodoTipo", "b")
        .where( "a.etapaEducativaId = :id ",  {id: id} )
        .getMany();

        return operativoEtapa;
       
   }
    async createOperativoEtapaEducativa (dto: CreateOperativoEtapaEducativaDto) {
             
        const datoOperativoEtapa = await this.operativoEtapaEducativaRepository.findOneBy( 
            {
                gestionTipoId: dto.gestionTipoId,
                periodoTipoId: dto.periodoTipoId,
                eventoTipoId: dto.eventoTipoId,
                etapaEducativaId: dto.etapaEducativaId 
            });

            if(!datoOperativoEtapa){

                const operativoEtapa = new OperativoEtapaEducativa();
                operativoEtapa.gestionTipo.id = dto.gestionTipoId;
                operativoEtapa.eventoTipo.id = dto.eventoTipoId;
                operativoEtapa.educacionTipo.id = dto.educacionTipoId;
                operativoEtapa.periodoTipo.id = dto.periodoTipoId;
                operativoEtapa.etapaEducativa.id = dto.etapaEducativaId;
                operativoEtapa.usuarioId = dto.usuarioId;
                operativoEtapa.fechaInicio = dto.fechaInicio;
                operativoEtapa.fechaFin = dto.fechaFin;
                operativoEtapa.activo = true;
                const result = await this.operativoEtapaEducativaRepository.save(operativoEtapa);
                return this._serviceResp.respuestaHttp201(
                    result,
                    '',
                    'Registro Creado !!',
                  );
            }else{
                console.log('ya existe el operativo etapa:',datoOperativoEtapa);
                return this._serviceResp.respuestaHttp201(
                    '',
                    '',
                    'El operativo ya existe !!',
                );
            }        
    }

}
