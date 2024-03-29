import { TurnoTipo } from './../../entidades/turnoTipo.entity';
import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { AulaRepository } from './aula.repository';
import { CreateAulaDto } from './dto/createAula.dto';
import { OfertaCurricularService } from '../oferta_curricular/oferta_curricular.service';
import { EntityManager, Repository } from 'typeorm';
import { AulaDetalle } from 'src/academico/entidades/aulaDetalle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Aula } from 'src/academico/entidades/aula.entity';
import { AulaDetalleService } from '../aula_detalle/aula_detalle.service';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { InstitutoEstudianteInscripcion } from 'src/academico/entidades/InstitutoEstudianteInscripcion.entity';
import { InstitutoEstudianteInscripcionDocenteCalificacion } from 'src/academico/entidades/institutoEstudianteInscripcionDocenteCalificacion.entity';

@Injectable()
export class AulaService {
    constructor(
        
        @Inject(AulaRepository) 
        private aulaRepository: AulaRepository,
        @InjectRepository(Aula) 
        private _aulaRepository:Repository <Aula>,
        @InjectRepository(InstitutoEstudianteInscripcion)
        private _institutoEstudianteInscripcionRepository: Repository<InstitutoEstudianteInscripcion>,
        @InjectRepository(InstitutoEstudianteInscripcionDocenteCalificacion)
        private _docenteCalificacionRepository: Repository<InstitutoEstudianteInscripcionDocenteCalificacion>,
        private ofertaService: OfertaCurricularService,
        private aulaDetalleService: AulaDetalleService,
        private _serviceResp: RespuestaSigedService, 

        @InjectRepository(AulaDetalle)
        private adRepository: Repository<AulaDetalle>,

        
    ){}

    async getAll(){
        const s = await this.aulaRepository.getAll()
        return s
    }
    async getById(id:number){
        // const aula = await this.aulaRepository.getByAulaId(id); // mejorando consulta
        const aula = await this._aulaRepository.findOne({
          relations:{
            aulasDocentes:{
              maestroInscripcion: { persona:true }
            },
            paraleloTipo: true,
            turnoTipo: true,
            ofertaCurricular: {
              institutoPlanEstudioCarrera: {
                planEstudioCarrera:{ intervaloGestionTipo: true}
              },
              planEstudioAsignatura: {
                asignaturaTipo: true,
              }
            }
          },
          where: {id: id }
        })
        return aula;
    }
    async getCalificacionesById(id:number){
        const aula = await this.aulaRepository.getCalificacionesByAulaId(id);
        return aula;
    }

    async deleteAula(id: number)
    { //console.log("borrado de aula***");
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
          /*if (result.affected === 0) {
            throw new NotFoundException("registro no encontrado !");
          }*/
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

  async checkDuplicate (aula_id)
  {
    //todo: revisar el modulo de inscripicion antes realizar este modulo 
    const estudiantes = await this._institutoEstudianteInscripcionRepository.find({where: {aulaId: aula_id}})
    // console.log('estudiantes', estudiantes)
    // const to_deleted = []
    // await Promise.all( estudiantes.map(async (estudiante)=>{
      
    //   const duplicados =  await this.code.find({where: {matriculaEstudianteId: estudiante.matriculaEstudianteId, aulaId: estudiante.aulaId}})
    //   // if(duplicados.length>1)
    //   // {
    //   //   console.log('duplicado',duplicados)
    //   // }
    //   if(duplicados.length > 1)
    //   {
    //       let can_delete = true
    //       const calificaciones =  await this._docenteCalificacionRepository.find({where: {institutoEstudianteInscripcionId: estudiante.id}})

    //       await Promise.all( calificaciones.map(async (calificacion )=>{
    //         console.log(calificacion.cuantitativa)
    //           if(calificacion.cuantitativa.toString() === "0.00")
    //           {
    //             console.log('intentando borrar')
    //             try {
    //               await this._docenteCalificacionRepository.delete(calificacion.id)
                  
    //             } catch (error) {
    //               can_delete = false
    //             }
    //           }else{
    //             can_delete = false
    //           }
    //       }))

    //       if(can_delete)

    //       {
    //         await this._institutoEstudianteInscripcionRepository.delete(estudiante.id)
    //         console.log('instituto_estudiante_inscripcion',estudiante.id)
    //       }

    //   }
    // }))
    return estudiantes
  }

    async createUpdateAulaDetalle (dto: CreateAulaDto, user:UserEntity) {
      console.log('payload',dto.aulas)
      const resultado = [];
      let ofertaId = 0;
        try {
          const oferta = await this.ofertaService.getOfertaByPlanAsignaturaGestionPeriodo(
            dto.instituto_plan_estudio_carrera_id,
            dto.gestion_tipo_id,
            dto.periodo_tipo_id,
            dto.plan_estudio_asignatura_id
        );
        if(!oferta){
            console.log("no existe oferta ingresa");
            const res = await this.adRepository
            .createQueryBuilder()
            .insert()
            .into(OfertaCurricular)
            .values([
                {
                    institutoPlanEstudioCarreraId: dto.instituto_plan_estudio_carrera_id,
                    gestionTipoId: dto.gestion_tipo_id,
                    periodoTipoId: dto.periodo_tipo_id,
                    planEstudioAsignaturaId: dto.plan_estudio_asignatura_id,
                    usuarioId: user.id,
                },
            ])
            .returning("id")
            .execute();
            
            console.log("res:", res);
            ofertaId = res.identifiers[0].id;
        }
        else{
            ofertaId = oferta.id;
        }

          for(const item of dto.aulas){
            let aulaId = 0;
            if(item.id == 0){
              const datoAula =  await this.aulaRepository.getDatoAula(
                ofertaId,
                item.paralelo_tipo_id
            );
              if(!datoAula){
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
                        usuarioId: user.id,
                        turnoTipoId: item.turno_tipo_id
                    },
                  ])
                  .returning("id")
                  .execute();
                  aulaId = resAula.identifiers[0].id;
              }
            }
            if(item.id>0){
               await this.adRepository
              .createQueryBuilder()
              .update(Aula)
              .set(
                {
                    cupo: item.cupo,
                    paraleloTipoId: item.paralelo_tipo_id,
                    turnoTipoId: item.turno_tipo_id
                },
              )
              .where({id:item.id})
              .execute();
              aulaId = item.id
            }

            for(const itemd of item.detalles){
              if(itemd.id ==0 && aulaId!=0){
                const datoDetalle =  await this.aulaDetalleService.getDatoAulaDetalle(
                  aulaId,
                  itemd.dia_tipo_id,
                  itemd.hora_inicio,
                  itemd.hora_fin
                );
                if(!datoDetalle){
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
                        usuarioId : user.id,
                    },
                  ])
                  .returning("id")
                  .execute();
                }
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
          for(const itemea of dto.eliminado_aulas){
            //console.log("el id a eliminar",itemea.id);
            await this.deleteAula(itemea.id);
          } 
          for(const itemed of dto.eliminado_detalles){
            await this.aulaDetalleService.deleteDetalle(itemed.id);
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
