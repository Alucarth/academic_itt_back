import { HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Aula } from 'src/academico/entidades/aula.entity';
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AulaRepository } from '../aula/aula.repository';
import { AulaDetalleRepository } from '../aula_detalle/aula_detalle.repository';
import { CreateOfertaCurricularDto } from './dto/createOfertaCurricular.dto';
import { OfertaCurricularRepository } from './oferta_curricular.repository';
import { PlanEstudioAsignatura } from 'src/academico/entidades/planEstudioAsignatura.entity';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { InstitutoPlanEstudioCarrera } from 'src/academico/entidades/institutoPlanEstudioCarrera.entity';
@Injectable()
export class OfertaCurricularService {
    constructor(
        @InjectRepository(OfertaCurricular)
        private ocRepository: Repository<OfertaCurricular>,

        @Inject(OfertaCurricularRepository) 
        private ofertaCurricularRepository: OfertaCurricularRepository,

        @Inject(AulaRepository) 
        private aulaRepository: AulaRepository,

        @Inject(AulaDetalleRepository) 
        private aulaDetalleRepository: AulaDetalleRepository,

        @InjectRepository(InstitutoPlanEstudioCarrera)
        private _institutoPlanEstudioCarreraRepository: Repository<InstitutoPlanEstudioCarrera>,

        private dataSource: DataSource,

        private _serviceResp: RespuestaSigedService, 
        
    ){}

    async getAll(){
        const cursos = await this.ofertaCurricularRepository.getAll()
        return cursos
    }

    async getAllByCarreraId(id:number){
        const cursos = await this.ofertaCurricularRepository.getAllByCarreraId(id)
        return cursos
    }

    async getOfertaByPlanAsignaturaGestionPeriodo(instituto:number, gestion:number, periodo:number,asignatura:number){
        const oferta = await this.ocRepository.findOneBy({
            
              institutoPlanEstudioCarreraId: instituto,
              gestionTipoId: gestion,
              periodoTipoId: periodo,
              planEstudioAsignaturaId: asignatura,
            
          });
            return oferta;
          

    }

    async getAllAsignaturasByCarreraGestionPeriodo(id:number, gestion:number, periodo:number){
        const oferta = await this.ofertaCurricularRepository.findOfertasByCarreraAutorizadaIdGestionPeriodo(id,gestion,periodo);

        if (oferta){
            return this._serviceResp.respuestaHttp201(
                oferta,
              "resultados encontrados !!",
              ""
            );
          }
          return this._serviceResp.respuestaHttp404(
            "",
            "no existen resultados !!",
            ""
          );
    }
    async getAllAsignaturasByCarreraGestionPeriodoDocente(id:number, gestion:number, periodo:number){
        const oferta = await this.ofertaCurricularRepository.findOfertasByCarreraAutorizadaIdGestionPeriodoDocente(id,gestion,periodo);
        console.log('ofertaXD',oferta)
        if (oferta){
            return this._serviceResp.respuestaHttp201(
                oferta,
              "resultados encontrados !!",
              ""
            );
          }
          return this._serviceResp.respuestaHttp404(
            "",
            "no existen resultados !!",
            ""
          );
    }
    
    async editar (request: any)
    {
      let plan_estudio_asignatura = request.planEstudioAsignatura
      let pea = await this.dataSource.getRepository(PlanEstudioAsignatura).findOne({
        relations:{
          ofertasCurriculares:{
            aulas:true 
          }
        },
        where:{
          id: plan_estudio_asignatura.id
        }
      })
      console.log(pea)
      return request
    }

    async createOfertaCurricular (dto: CreateOfertaCurricularDto[]) {
     
         console.log("servicio");
     
       const resultado = [];
       for(const item of dto){

                const op = async (transaction: EntityManager) => {
             
                    console.log("inicio");
                      console.log(item);
                      const datoOferta = {
                        instituto_plan_estudio_carrera_id: item.instituto_plan_estudio_carrera_id,
                        gestion_tipo_id: item.gestion_tipo_id,
                        periodo_tipo_id: item.periodo_tipo_id,
                        plan_estudio_asignatura_id: item.plan_estudio_asignatura_id,
                        usuario_id: 1,
                      };
                        const nuevaOferta =  await this.ofertaCurricularRepository.createOfertaCurricular(
                            datoOferta,
                            transaction
                        );
                      
                        if(nuevaOferta?.id){
                            console.log("INSERTADO OFERTA");
                            console.log(nuevaOferta.id);
                            for(const aula of item.aulas){
                                const datoAula = {
                                    oferta_curricular_id: nuevaOferta.id,
                                    cupo: aula.cupo,
                                    paralelo_tipo_id: aula.paralelo_tipo_id,
                                    usuario_id: 1
                                  };
                                const nuevaAula =  await this.aulaRepository.createAula(
                                    datoAula,
                                    transaction
                                );
                                if(nuevaAula?.id){
                                   /* await this.aulaDetalleRepository.createAulaDetalle(
                                        1,
                                        nuevaAula.id,
                                        aula.detalles, 
                                        transaction
                                    );*/
                                }
                            }
                        }
                    return nuevaOferta;
                }
                const crearResult = await this.ofertaCurricularRepository.runTransaction(op);
                if(crearResult){
                    resultado.push(crearResult);
                }
        }
        
           // console.log("fin");
            if(resultado.length>0){
              return this._serviceResp.respuestaHttp201(
                  resultado,
                  'Registro de curso y paralelos Creado !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
        
        
    }

    async crear (dto: CreateOfertaCurricularDto[], user:UserEntity) {
      
            try {
              for(const item of dto){
                //buscamos oferta
                const oferta = await this.getOfertaByPlanAsignaturaGestionPeriodo(
                    item.instituto_plan_estudio_carrera_id,
                    item.gestion_tipo_id,
                    item.periodo_tipo_id,
                    item.plan_estudio_asignatura_id
                );

                let ofertaId = 0;
                if(!oferta){
                    console.log("no existe ingresa");
                    const res = await this.ocRepository
                    .createQueryBuilder()
                    .insert()
                    .into(OfertaCurricular)
                    .values([
                        {
                            institutoPlanEstudioCarreraId: item.instituto_plan_estudio_carrera_id,
                            gestionTipoId: item.gestion_tipo_id,
                            periodoTipoId: item.periodo_tipo_id,
                            planEstudioAsignaturaId: item.plan_estudio_asignatura_id,
                            usuarioId: user.id,
                        },
                    ])
                    .returning("id")
                    .execute();
                    
                    console.log("res:", res);
                    ofertaId = res.identifiers[0].id;
                }else{
                    ofertaId = oferta.id;
                }

                if(ofertaId>0){
                  for(const aula of item.aulas){
                        const datoAula =  await this.aulaRepository.getDatoAula(
                            ofertaId,
                            aula.paralelo_tipo_id
                        );
                        let aulaId = 0;
                        if(datoAula==null){
                          const resAula = await this.ocRepository
                          .createQueryBuilder()
                          .insert()
                          .into(Aula)
                          .values([
                            {
                                ofertaCurricularId: ofertaId,
                                activo: true,
                                cupo: aula.cupo,
                                paraleloTipoId: aula.paralelo_tipo_id,
                                usuarioId: user.id,
                            },
                          ])
                          .returning("id")
                          .execute();
                          aulaId = resAula.identifiers[0].id;
                        }else{
                            aulaId = datoAula.id;
                        }
                            if(aulaId>0){
                                const detalles = await this.aulaDetalleRepository.getDetallesByAulaId(aulaId);
                                const nuevos = await this.aulaDetalleRepository.verificarAulasDetalles(detalles, aula.detalles);

                                console.log(nuevos);
                                await this.aulaDetalleRepository.createAulaDetalle(
                                    user.id,
                                    aulaId,
                                    nuevos//aula.detalles
                                );    
                            }
                  }
                }
                
                }
                return this._serviceResp.respuestaHttp201(
                    "",
                    "Registro Creado !!",
                    ""
                  );
            } catch (error) {
                console.log("Error insertar inscripcion: ", error);
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
    async deleteOferta(id: number)
    {
      const result =  await this.ofertaCurricularRepository.deleteOferta(id);
        if (result.affected === 0) {
            throw new NotFoundException("registro no encontrado !");
          }
          return this._serviceResp.respuestaHttp203(
            result,
            "Registro Eliminado !!",
            ""
          );
        
    }
    async getRegimenEstudio(instituto_plan_estudio_carrera_id: number)
    {
      const instituto_plan_estudio_carrera = this._institutoPlanEstudioCarreraRepository.findOne({
        where:{ id: instituto_plan_estudio_carrera_id}
      })
      return instituto_plan_estudio_carrera
    }
}
