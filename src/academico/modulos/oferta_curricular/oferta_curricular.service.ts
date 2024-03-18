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
import { RegimenGradoTipo } from 'src/academico/entidades/regimenGradoTipo.entity';
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

        @InjectRepository(RegimenGradoTipo)
        private _regimenGradoTipoRepository: Repository<RegimenGradoTipo>,

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

    async getAllAsignaturasByRegimenGrado(id:number, gestion:number, periodo:number, regimen_grado: number){
      const oferta = await this.ofertaCurricularRepository.findOfertasByCarreraAutorizadaIdGestionPeriodoRegimenGrado(id,gestion,periodo,regimen_grado);
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
      const instituto_plan_estudio_carrera = await this._institutoPlanEstudioCarreraRepository.findOne({
        relations:{
          planEstudioCarrera: {
            planEstudioResolucion:true,
            carreraTipo:true,
            nivelAcademicoTipo:true,
            intervaloGestionTipo:true,
          },
          carreraAutorizada:{
            carreraTipo:true,
          }

        },
        where:{ id: instituto_plan_estudio_carrera_id}
      })
      const gestion_tipos = [ {id: 2023, gestion:'2023'},{id: 2024, gestion:'2024'} ]
      const regimen_grado_tipos = await this._regimenGradoTipoRepository.find({
          where: {intervaloGestionTipoId: instituto_plan_estudio_carrera.planEstudioCarrera.intervaloGestionTipoId },
          order: { id: 'ASC' }
        })
      return {instituto_plan_estudio_carrera: instituto_plan_estudio_carrera, regimen_grado_tipos: regimen_grado_tipos, gestion_tipos: gestion_tipos}
    }
    async getParalelosOfertaCurricular(instituto_plan_estudio_carrera_id: number,regimen_grado_tipo_id: number, gestion_tipo_id: number ,periodo_tipo_id: number)
    {

      const total_estudiantes = await this._institutoPlanEstudioCarreraRepository.query(`
          select count(distinct (iee.persona_id)) as total_estudiantes from oferta_curricular oc 
          inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
          inner join aula a on a.oferta_curricular_id = oc.id
          inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id 
          inner join turno_tipo tt on tt.id = a.turno_tipo_id
          inner join instituto_estudiante_inscripcion iei on iei.aula_id  = a.id 
          inner join matricula_estudiante me on me.id = iei.matricula_estudiante_id 
          inner join institucion_educativa_estudiante iee on iee.id = me.institucion_educativa_estudiante_id 
          where oc.instituto_plan_estudio_carrera_id = ${instituto_plan_estudio_carrera_id} and pea.regimen_grado_tipo_id = ${regimen_grado_tipo_id} and oc.gestion_tipo_id = ${gestion_tipo_id};
      `) 
      

      const total_turnos = await this._institutoPlanEstudioCarreraRepository.query(`
          select   a.turno_tipo_id, tt.turno, count(distinct (a.paralelo_tipo_id)) as total_pararelos
          from oferta_curricular oc 
          inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
          inner join aula a on a.oferta_curricular_id = oc.id
          inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id 
          inner join turno_tipo tt on tt.id = a.turno_tipo_id
          where oc.instituto_plan_estudio_carrera_id = ${instituto_plan_estudio_carrera_id} and pea.regimen_grado_tipo_id = ${regimen_grado_tipo_id} and oc.gestion_tipo_id = ${gestion_tipo_id}
          group by  a.turno_tipo_id, tt.turno;
      `)

      const total_asignaturas = await this._institutoPlanEstudioCarreraRepository.query(`
          select count(distinct (pea.asignatura_tipo_id)) as total_asignaturas from oferta_curricular oc 
          inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
          inner join aula a on a.oferta_curricular_id = oc.id
          inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id 
          inner join turno_tipo tt on tt.id = a.turno_tipo_id
          inner join instituto_estudiante_inscripcion iei on iei.aula_id  = a.id 
          inner join matricula_estudiante me on me.id = iei.matricula_estudiante_id 
          inner join institucion_educativa_estudiante iee on iee.id = me.institucion_educativa_estudiante_id 
          where oc.instituto_plan_estudio_carrera_id = ${instituto_plan_estudio_carrera_id} and pea.regimen_grado_tipo_id = ${regimen_grado_tipo_id}  and oc.gestion_tipo_id = ${gestion_tipo_id};
      `)

      
      const paralelos = await this._institutoPlanEstudioCarreraRepository.query(`select a.paralelo_tipo_id, pt.paralelo , a.turno_tipo_id, tt.turno
                      from oferta_curricular oc 
                      inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
                      inner join aula a on a.oferta_curricular_id = oc.id
                      inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id 
                      inner join turno_tipo tt on tt.id = a.turno_tipo_id
                      where oc.instituto_plan_estudio_carrera_id = ${instituto_plan_estudio_carrera_id} and pea.regimen_grado_tipo_id = ${regimen_grado_tipo_id} and oc.gestion_tipo_id = ${gestion_tipo_id} and oc.periodo_tipo_id = ${periodo_tipo_id}
                      group by a.paralelo_tipo_id, a.turno_tipo_id,pt.paralelo, tt.turno;`)
      console.log('paralelos',paralelos)

      await Promise.all(paralelos.map(async (paralelo)=>{
        let result = await this._institutoPlanEstudioCarreraRepository.query(`
          select count(distinct (iee.persona_id)) as total_estudiantes from oferta_curricular oc 
          inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
          inner join aula a on a.oferta_curricular_id = oc.id
          inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id 
          inner join turno_tipo tt on tt.id = a.turno_tipo_id
          inner join instituto_estudiante_inscripcion iei on iei.aula_id  = a.id 
          inner join matricula_estudiante me on me.id = iei.matricula_estudiante_id 
          inner join institucion_educativa_estudiante iee on iee.id = me.institucion_educativa_estudiante_id 
          where oc.instituto_plan_estudio_carrera_id = ${instituto_plan_estudio_carrera_id} and pea.regimen_grado_tipo_id = ${regimen_grado_tipo_id}  and oc.gestion_tipo_id = ${gestion_tipo_id} and oc.periodo_tipo_id = ${periodo_tipo_id} and paralelo_tipo_id = ${paralelo.paralelo_tipo_id} and turno_tipo_id = ${paralelo.turno_tipo_id};`)
        
          paralelo.total_estudiantes = result[0].total_estudiantes

          result = await this._institutoPlanEstudioCarreraRepository.query(`
          select a.id as aula_id, pt.paralelo, tt.turno,at2.abreviacion , at2.asignatura, p.nombre , p.paterno,
          p.materno,
          (select count(*) as total_estudiantes  from instituto_estudiante_inscripcion iei where aula_id = a.id)
          from oferta_curricular oc 
          inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
          inner join asignatura_tipo at2 on at2.id = pea.asignatura_tipo_id 
          inner join aula a on a.oferta_curricular_id = oc.id
          inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id 
          inner join turno_tipo tt on tt.id = a.turno_tipo_id
          left join aula_docente ad on ad.aula_id  = a.id
          left join maestro_inscripcion mi on mi.id = ad.maestro_inscripcion_id 
          left join persona p on p.id = mi.persona_id 
          where ad.baja_tipo_id = 0 and oc.instituto_plan_estudio_carrera_id = ${instituto_plan_estudio_carrera_id} and pea.regimen_grado_tipo_id = ${regimen_grado_tipo_id}  and oc.gestion_tipo_id = ${gestion_tipo_id} and oc.periodo_tipo_id = ${periodo_tipo_id} and a.paralelo_tipo_id = ${paralelo.paralelo_tipo_id} and a.turno_tipo_id = ${paralelo.turno_tipo_id};
          `)
          paralelo.list = result
        
        
        }))

      
      return { paralelos: paralelos, total_estudiantes: total_estudiantes[0].total_estudiantes, total_turnos: total_turnos, total_asignaturas: total_asignaturas[0].total_asignaturas }
    }

    async getHomologationSubject(instituto_plan_estudio_carrera_id: number, persona_id: number,regimen_grado_tipo_id:number)
    {
      // const regimen_list = await this._institutoPlanEstudioCarreraRepository.query(`
      //   select hge.regimen_grado_tipo_id, rgt.regimen_grado  from homologados_gestion_estudiante hge 
      //   inner join instituto_estudiante_inscripcion iei ON iei.id = hge.instituto_estudiante_inscripcion_id 
      //   inner join matricula_estudiante me on me.id = iei.matricula_estudiante_id 
      //   inner join institucion_educativa_estudiante iee on iee.id = me.institucion_educativa_estudiante_id 
      //   inner join persona p on p.id = iee.persona_id 
      //   inner join regimen_grado_tipo rgt on rgt.id = hge.regimen_grado_tipo_id 
      //   where hge.to_instituto_plan_estudio_carrera_id = ${instituto_plan_estudio_carrera_id} and p.id = ${persona_id} group by hge.regimen_grado_tipo_id, rgt.regimen_grado;
      // `);
       
      // await Promise.all( regimen_list.map(async ( regimen: any) => {

         const subjects = await this._institutoPlanEstudioCarreraRepository.query(`
         select at2.abreviacion, at2.asignatura, emt.estado_matricula, p2.carnet_identidad, p2.complemento, p2.nombre, p2.paterno, p2.materno  from homologados_gestion_estudiante hge 
         inner join instituto_estudiante_inscripcion iei ON iei.id = hge.instituto_estudiante_inscripcion_id 
         inner join matricula_estudiante me on me.id = iei.matricula_estudiante_id 
         inner join institucion_educativa_estudiante iee on iee.id = me.institucion_educativa_estudiante_id 
         inner join persona p on p.id = iee.persona_id 
         inner join aula a on a.id = iei.aula_id 
         inner join oferta_curricular oc on oc.id = a.oferta_curricular_id 
         inner join plan_estudio_asignatura pea on pea.id = oc.plan_estudio_asignatura_id 
         inner join asignatura_tipo at2 on at2.id = pea.asignatura_tipo_id 
         inner join estado_matricula_tipo emt  on emt.id = hge.to_estado_matricula_tipo_id 
         inner join usuario u on u.id = hge.usuario_id 
         inner join persona p2 on p2.id = u.persona_id 
         where hge.to_instituto_plan_estudio_carrera_id = ${instituto_plan_estudio_carrera_id} and p.id = ${persona_id} and hge.regimen_grado_tipo_id = ${regimen_grado_tipo_id} order by hge.index_sort  asc;
         `)
      //   regimen.subjects = subjects

      // } ))
      
      return subjects
    }
}
