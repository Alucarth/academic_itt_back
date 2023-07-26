import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaRepository } from './aula.repository';
import { CreateAulaDto } from './dto/createAula.dto';
import { OfertaCurricularService } from '../oferta_curricular/oferta_curricular.service';
import { EntityManager, Repository } from 'typeorm';
import { AulaDetalle } from 'src/academico/entidades/aulaDetalle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Aula } from 'src/academico/entidades/aula.entity';

@Injectable()
export class AulaService {
    constructor(
        
        @Inject(AulaRepository) 
        private aulaRepository: AulaRepository,
        private ofertaService: OfertaCurricularService,
        private _serviceResp: RespuestaSigedService, 

        @InjectRepository(AulaDetalle)
        private adRepository: Repository<AulaDetalle>,

        
    ){}

    async getAll(){
        const s = await this.aulaRepository.getAll()
        return s
    }
    async getById(id:number){
        const aula = await this.aulaRepository.getByAulaId(id);
        return aula;
    }
    async getCalificacionesById(id:number){
        const aula = await this.aulaRepository.getCalificacionesByAulaId(id);
        return aula;
    }

    async deleteAula(id: number)
    {
        const estudiantes = await this.aulaRepository.getInscritosByAulaId(id);

     
      if(estudiantes.length>0){
        return this._serviceResp.respuestaHttp500(
            "",
            "No se puede eliminar los datos existen estudiantes inscritos !!",
            ""
          );
      }
      const resultDetalle = await this.aulaRepository.deleteAulaDetalle(id);

      const resultDocente = await this.aulaRepository.deleteAulaDocente(id);
    if(resultDetalle || resultDocente){
        const result = await this.aulaRepository.deleteAula(id);
        console.log("resultado",result);
        if (result.affected === 0) {
          throw new NotFoundException("registro no encontrado !");
        }
        return this._serviceResp.respuestaHttp203(
            result,
            "Registro Eliminado !!",
            ""
          );
          
    }
    if (resultDetalle.affected === 0 ) {
        throw new NotFoundException("registro no encontrado !");
      }
     
    }

    async createUpdateAulaDetalle (dto: CreateAulaDto) {
      const resultado = [];
        try {
          const oferta = await this.ofertaService.getOfertaByPlanAsignaturaGestionPeriodo(
            dto.instituto_plan_estudio_carrera_id,
            dto.gestion_tipo_id,
            dto.periodo_tipo_id,
            dto.plan_estudio_asignatura_id
        );
          let ofertaId = oferta.id;

          for(const item of dto.aulas){
            let aulaId = 0;
            if(item.id ==0){
              const resAula = await this.adRepository
              .createQueryBuilder()
              .insert()
              .into(Aula)
              .values([
                {
                    ofertaCurricularId: ofertaId,
                    activo: true,
                    cupo: item.cupo,
                    paraleloTipoId: item.paralelo_tipo_id,
                    usuarioId: 1,
                },
              ])
              .returning("id")
              .execute();
              aulaId = resAula.identifiers[0].id;
            }
            if(item.id>0){
              const resAula = await this.adRepository
              .createQueryBuilder()
              .update(Aula)
              .set(
                {
                    cupo: item.cupo,
                    paraleloTipoId: item.paralelo_tipo_id,
                },
              )
              .where({id:item.id})
              .execute();
              aulaId = item.id
            }

            for(const itemd of item.detalles){
              if(itemd.id ==0){
                await this.adRepository
                .createQueryBuilder()
                .insert()
                .into(AulaDetalle)
                .values([
                  {
                      aulaId: aulaId,
                      diaTipoId : itemd.dia_tipo_id,
                      horaInicio : itemd.hora_inicio,
                      horaFin : itemd.hora_fin,
                      numeroAula : itemd.numero_aula,
                      usuarioId : 1,
                  },
                ])
                .returning("id")
                .execute();
              }
              if(itemd.id >0){
                await this.adRepository
                .createQueryBuilder()
                .update(AulaDetalle)
                .set(
                  {
                    diaTipoId : itemd.dia_tipo_id,
                    horaInicio : itemd.hora_inicio,
                    horaFin : itemd.hora_fin,
                    numeroAula : itemd.numero_aula
                  },
                )
                .where({id:itemd.id})
                .execute();
              }

            } 
            
          }
            return this._serviceResp.respuestaHttp201(
                "",
                "Registro Actualizado/Creado !!",
                ""
              );
          } catch (error) {
            console.log("Error insertar aulas: ", error);
            throw new HttpException(
              {
                status: HttpStatus.CONFLICT,
                error: `Error insertar Matricula: ${error.message}`,
              },
              HttpStatus.ACCEPTED,
              {
                cause: error,
              }
            );
        }
  }
}
