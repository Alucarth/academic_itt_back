import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { OfertaAcademicaMaestroInscripcion } from 'src/academico/entidades/ofertaAcademicaMaestroInscripcion.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateOfertaAcademicaMaestroInscripcionDto } from './dto/createOfertaAcademicaMaestroInscripcion.dto';
import { OfertaAcademicaMaestroInscripcionRepository } from './oferta_academica_maestro_inscripcion.repository';

@Injectable()
export class OfertaAcademicaMaestroInscripcionService {
    institucionEducativaCursoRepository: any;
    constructor(
        @Inject(OfertaAcademicaMaestroInscripcionRepository)
        private oaMaeRepository: OfertaAcademicaMaestroInscripcionRepository,
        private _serviceResp: RespuestaSigedService,
    ){}

    async getAll(){
        const oaMaes = await this.oaMaeRepository.getAll()
        return oaMaes;
    }


    async createOFertaAcademicaMaestroInscripcion(dto: CreateOfertaAcademicaMaestroInscripcionDto) {

        console.log("servicio de insercion inicio");
        const op = async (transaction: EntityManager) => {
            const nuevoCurso =  await this.oaMaeRepository.createOfertaAcademicaMaestroInscripcion(
              dto,
              transaction
            )
            return nuevoCurso;
          }

        const crearResult = await this.oaMaeRepository.runTransaction(op)

        if(crearResult){
            return this._serviceResp.respuestaHttp201(
                crearResult,
                'Registro de curso y maestro  Creado !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo guardar la información !!',
            '',
        );
  
    }

    async getByEtapa(id:number, gestion:number, periodo:number){
        const cursos = await this.oaMaeRepository.getAllByEtapa(id, gestion, periodo)
        return cursos
    }
}
