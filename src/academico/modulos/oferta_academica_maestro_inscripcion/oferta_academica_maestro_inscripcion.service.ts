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

    async getOfertasAcademicas(idMaestroInscripcion:number){
        const oaMaes = await this.oaMaeRepository.getOfertasAcademicas(idMaestroInscripcion);
        return oaMaes;
    }


    async createOFertaAcademicaMaestroInscripcion(dto: CreateOfertaAcademicaMaestroInscripcionDto) {

        console.log("servicio de insercion inicio");
        const ofertasMaestro = await this.oaMaeRepository.getOfertasAcademicas(dto.maestroInscripcionId);
        
        const nuevos  = await this.verificarOfertasAcademicas(
            ofertasMaestro, 
            dto.ofertaAcademica 
          )
        dto.ofertaAcademica = nuevos;
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
                'Registro de curso y maestro  Creado  !!',
                '',
            );
        }
        return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo guardar la información !!',
            '',
        );
  
    }

    verificarOfertasAcademicas(ofertasAcademicas, ofertas) {
     
        const nuevos = ofertas.filter((of) =>
        ofertasAcademicas.every((ofAc) => ofAc.ofertaAcademicaId != of.id)
        )
        
        return  nuevos
        
    }

    async deleteOfertaAcademicaMaestroInscripcion(id: number) {
        const op = async (transaction: EntityManager) => {
            const deleteCurso =  await this.oaMaeRepository.deleteOfertaAcademicaMaestroInscripcion(
              id,
              transaction
            )
            return deleteCurso;
          }
          const crearResult = await this.oaMaeRepository.runTransaction(op)

          if(crearResult){
              return this._serviceResp.respuestaHttp201(
                  '',
                  'Borrados datos de Oferta y Docente/Maestro  !!',
                  '',
              );
          }  
          return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo eliminar la información !!',
            '',
        );

    }

    async getByEtapa(id:number, gestion:number, periodo:number){
        const cursos = await this.oaMaeRepository.getAllByEtapa(id, gestion, periodo)
        return cursos
    }
}
