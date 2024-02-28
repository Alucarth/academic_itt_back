import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AulaDocente } from 'src/academico/entidades/aulaDocente.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { EntityManager, Repository } from 'typeorm';
import { AulaDocenteRepository } from './aula_docente.repository';
import { CreateAulaDocenteDto } from './dto/createAulaDocente.dto';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { Aula } from 'src/academico/entidades/aula.entity';
import { MaestroInscripcion } from 'src/academico/entidades/maestroInscripcion.entity';

@Injectable()
export class AulaDocenteService {
    constructor(
        @Inject(AulaDocenteRepository)
        private aulaDocenteRepositorio: AulaDocenteRepository,
        @InjectRepository(Aula)
        private _aulaRepository: Repository<Aula>,
        @InjectRepository(MaestroInscripcion)
        private _maestroInscripcionRepository: Repository<MaestroInscripcion>,
        private _serviceResp: RespuestaSigedService
      ) {}
      async getAll() {
        const aulas = await this.aulaDocenteRepositorio.findAll();
        return aulas;
      }
      async getCarrerasByDocenteId(id:number){
        const aulas = await this.aulaDocenteRepositorio.findAllCarrerasByDocenteId(id);
        if (aulas){
          return this._serviceResp.respuestaHttp201(
            aulas,
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
      async getCarrerasByPersonaId(id:number){
        const aulas = await this.aulaDocenteRepositorio.findAllCarrerasByPersonaId(id);
        if (aulas){
          return this._serviceResp.respuestaHttp201(
            aulas,
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
      async getCarrerasDocentesAulasByPersonaId(id:number){
        const aulas = await this.aulaDocenteRepositorio.findAllCarrerasDocentesAulasByPersonaId(id);
        if (aulas){
          return this._serviceResp.respuestaHttp201(
            aulas,
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
   
      async crearAulaDocenteAntes (dto: CreateAulaDocenteDto[], user:UserEntity) {
        console.log("lista array inicio");
        console.log(dto);
        console.log(dto.length);
        console.log("lista array");
        const resultado = [];
        for(const item of dto){
          //buscamos docente en esa aula
          const docente = await this.aulaDocenteRepositorio.getOneDocenteByAulaId(item.aula_id);
          const op = async (transaction: EntityManager) => {
            //console.log(datoCalificacion);
                if(docente && docente.maestro_inscripcion_id!=item.maestro_inscripcion_id){
                  console.log("desactiva");
                  const actualizados = await this.aulaDocenteRepositorio.updateDocenteAulaVigencia(
                        docente.id,
                        item.fecha_inicio
                    );
                    resultado.push(actualizados);
                }
                if(!docente || docente.maestro_inscripcion_id!=item.maestro_inscripcion_id){
                  console.log("inserta");
                  const nuevos = await this.aulaDocenteRepositorio.crearDocenteAula(
                            user.id,
                            item,
                            transaction
                        );
                        resultado.push(nuevos);
                 }
                 
                 if(docente && docente.maestro_inscripcion_id==item.maestro_inscripcion_id){
                  console.log("edita");
                  const actualizados = await this.aulaDocenteRepositorio.updateDocenteAula(
                            docente.id,
                            item
                        );
                        resultado.push(actualizados);
                 }
            }
              const crearResult = await this.aulaDocenteRepositorio.runTransaction(op);
              console.log(crearResult);
          
        }
        //return resultado;
          if(resultado.length>0){
            return this._serviceResp.respuestaHttp201(
                resultado,
                'Registro Creado !!',
                '',
            );
          }
          return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo guardar la información !!',
            '',
        );
    }
      async crearAulaDocente (dto: CreateAulaDocenteDto[], user:UserEntity) {
          console.log("lista array inicio");
          console.log(dto);
          console.log(dto.length);
          console.log("lista array");
          const resultado = [];
          for(const item of dto){
            //buscamos docente en esa aula
            const docente = await this.aulaDocenteRepositorio.getOneAulaDocente(item.aula_id, item.maestro_inscripcion_id);
            console.log("existe docente",docente);
            const op = async (transaction: EntityManager) => {
              //console.log(datoCalificacion);
                  await this.aulaDocenteRepositorio.updateDocenteAulaVigenciaByAula(
                    item.aula_id,
                    item.fecha_inicio
                  );
                  if(!docente){
                    console.log("desactiva  alos otros");
                    //desactiva a otros docentes de esa aula
                   
                    console.log("inserta el nuevo");
                    const nuevos = await this.aulaDocenteRepositorio.crearDocenteAula(
                              user.id,
                              item,
                              transaction
                          );
                          resultado.push(nuevos);
                   }
                   if(docente){
                    console.log("edita");
                    const actualizados = await this.aulaDocenteRepositorio.updateDocenteAula(
                              docente.id,
                              item
                          );
                          resultado.push(actualizados);
                   }
              }
                const crearResult = await this.aulaDocenteRepositorio.runTransaction(op);
                console.log(crearResult);
            
          }
          //return resultado;
            if(resultado.length>0){
              return this._serviceResp.respuestaHttp201(
                  resultado,
                  'Registro Creado !!',
                  '',
              );
            }
            return this._serviceResp.respuestaHttp500(
              "",
              'No se pudo guardar la información !!',
              '',
          );
      }

      async crearDocenteAulaArray (dto: CreateAulaDocenteDto[]) {
        console.log("lista array inicio");
        console.log(dto);
        console.log(dto.length);
        console.log("lista array");
      
          const op = async (transaction: EntityManager) => {
              const nuevo = await this.aulaDocenteRepositorio.crearDocentesAulas(
                  1, 
                  dto, 
                  transaction
              );
            return nuevo;
          }

          const crearResult = await this.aulaDocenteRepositorio.runTransaction(op)

          if(crearResult.length>0){
            return this._serviceResp.respuestaHttp201(
                crearResult,
                'Registro Creado !!',
                '',
            );
          }
          return this._serviceResp.respuestaHttp500(
            "",
            'No se pudo guardar la información !!',
            '',
        );
    }

    async getGestionsByTeacher( persona_id: number, institucion_educativa_sucursal_id: number )
    {
      const maestro_inscripcion = await this._maestroInscripcionRepository.findOne({
        where: { personaId: persona_id, institucionEducativaSucursalId: institucion_educativa_sucursal_id}
      })
      if(!maestro_inscripcion)
      {
        throw new NotFoundException('Maestro Inscripcion not found');
      }
      //TODO: traducir a orm
      const gestions = await this._aulaRepository.query(` 
        select oc.gestion_tipo_id  from aula_docente ad 
        inner join maestro_inscripcion mi on mi.id = ad.maestro_inscripcion_id 
        inner join aula a on a.id = ad.aula_id 
        inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id
        inner join oferta_curricular oc on oc.id = a.oferta_curricular_id 
        inner join instituto_plan_estudio_carrera ipec on ipec.id = oc.instituto_plan_estudio_carrera_id 
        inner join plan_estudio_carrera pec on pec.id = ipec.plan_estudio_carrera_id 
        inner join plan_estudio_resolucion per on per.id = pec.plan_estudio_resolucion_id 
        where ad.maestro_inscripcion_id  = ${maestro_inscripcion.id} and mi.vigente= true and mi.institucion_educativa_sucursal_id = ${maestro_inscripcion.institucionEducativaSucursalId}
        group by oc.gestion_tipo_id 
        order by oc.gestion_tipo_id asc ;
      `);

      return gestions;
    }

    async getResolutionsByTeacher( payload: any)
    {
      const maestro_inscripcion = await this._maestroInscripcionRepository.findOne({
        where: { personaId: payload.persona_id, institucionEducativaSucursalId: payload.institucion_educativa_sucursal_id}
      })
      if(!maestro_inscripcion)
      {
        throw new NotFoundException('Maestro Inscripcion not found');
      }
      //TODO: translate to typeorm
      const resolutions = await this._aulaRepository.query(` 
        select oc.instituto_plan_estudio_carrera_id, ct.carrera, ca.id as carrera_autorizada_id,  per.numero_resolucion, igt.intervalo_gestion, pec.intervalo_gestion_tipo_id   from aula_docente ad 
        inner join maestro_inscripcion mi on mi.id = ad.maestro_inscripcion_id 
        inner join aula a on a.id = ad.aula_id 
        inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id
        inner join oferta_curricular oc on oc.id = a.oferta_curricular_id 
        inner join instituto_plan_estudio_carrera ipec on ipec.id = oc.instituto_plan_estudio_carrera_id 
        inner join plan_estudio_carrera pec on pec.id = ipec.plan_estudio_carrera_id 
        inner join plan_estudio_resolucion per on per.id = pec.plan_estudio_resolucion_id
        inner join carrera_autorizada ca on ca.id = ipec.carrera_autorizada_id 
        inner join carrera_tipo ct  on ct.id = ca.carrera_tipo_id 
        inner join intervalo_gestion_tipo igt on igt.id = pec.intervalo_gestion_tipo_id 
        where ad.maestro_inscripcion_id  = ${maestro_inscripcion.id} and oc.gestion_tipo_id = ${payload.gestion_tipo_id} and mi.vigente= true and mi.institucion_educativa_sucursal_id = ${maestro_inscripcion.institucionEducativaSucursalId}
        group by oc.instituto_plan_estudio_carrera_id, ct.carrera, per.numero_resolucion, igt.intervalo_gestion, ca.id, pec.intervalo_gestion_tipo_id ;
      `);

      return resolutions;
    }

    async getSubjectsByTeacher( payload: any)
    {
      const maestro_inscripcion = await this._maestroInscripcionRepository.findOne({
        where: { personaId: payload.persona_id, institucionEducativaSucursalId: payload.institucion_educativa_sucursal_id}
      })
      if(!maestro_inscripcion)
      {
        throw new NotFoundException('Maestro Inscripcion not found');
      }

      const subjects = await this._aulaRepository.query(`
        select pt.paralelo,tt.turno , at2.asignatura , at2.abreviacion  , a.id as aula_id, pt2.periodo, oc.periodo_tipo_id, ca.id as carrera_autorizada_id, oc.gestion_tipo_id  , oc.instituto_plan_estudio_carrera_id, ct.carrera,  per.numero_resolucion  from aula_docente ad 
        inner join maestro_inscripcion mi on mi.id = ad.maestro_inscripcion_id 
        inner join aula a on a.id = ad.aula_id 
        inner join paralelo_tipo pt on pt.id = a.paralelo_tipo_id
        inner join oferta_curricular oc on oc.id = a.oferta_curricular_id 
        inner join instituto_plan_estudio_carrera ipec on ipec.id = oc.instituto_plan_estudio_carrera_id 
        inner join plan_estudio_carrera pec on pec.id = ipec.plan_estudio_carrera_id 
        inner join plan_estudio_resolucion per on per.id = pec.plan_estudio_resolucion_id
        inner join carrera_autorizada ca on ca.id = ipec.carrera_autorizada_id 
        inner join carrera_tipo ct  on ct.id = ca.carrera_tipo_id 
        inner join periodo_tipo pt2 on pt2.id = oc.periodo_tipo_id 
        inner join plan_estudio_asignatura pea  on pea.id = oc.plan_estudio_asignatura_id 
        inner join asignatura_tipo at2 on at2.id  = pea.asignatura_tipo_id 
        inner join turno_tipo tt on tt.id  = a.turno_tipo_id 
        where ad.maestro_inscripcion_id  = ${maestro_inscripcion.id} and oc.gestion_tipo_id = ${payload.gestion_tipo_id} and mi.vigente= true and oc.instituto_plan_estudio_carrera_id = ${payload.instituto_plan_estudio_carrera_id} and mi.institucion_educativa_sucursal_id = ${maestro_inscripcion.institucionEducativaSucursalId};
      `);
      return subjects
    }
}
