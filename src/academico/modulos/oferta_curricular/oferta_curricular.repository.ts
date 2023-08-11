import { Injectable } from '@nestjs/common'
import { OfertaCurricular } from 'src/academico/entidades/ofertaCurricular.entity';
import { DataSource, EntityManager } from 'typeorm'
import { CreateOfertaCurricularDto } from './dto/createOfertaCurricular.dto';

@Injectable()
export class OfertaCurricularRepository {
    
    constructor(private dataSource: DataSource) {}

    async getAll(){
        return  await this.dataSource.getRepository(OfertaCurricular).find();
    }
    
   
    async getAllByCarreraId(id:number){
        
        console.log(id);
        const cursos = await this.dataSource.getRepository(OfertaCurricular)
        .createQueryBuilder("o")
        .innerJoinAndSelect("o.institutoPlanEstudioCarrera", "ip")
        .innerJoinAndSelect("o.gestionTipo", "g")
        .innerJoinAndSelect("o.periodoTipo", "p")
        .innerJoinAndSelect("o.planEstudioAsignatura", "pa")
        .innerJoinAndSelect("pa.asignaturaTipo", "a")
        .innerJoinAndSelect("pa.regimenGradoTipo", "r")
        .innerJoinAndSelect("o.aulas", "al")
        .innerJoinAndSelect("al.paraleloTipo", "pt")
        .where('ip.carreraAutorizadaId = :id ', { id })
        .orderBy('a.id', 'ASC')
        .getMany();
        console.log("ofertas desde backen");
        console.log(cursos);
        return cursos;
        
    }

    async findOfertasByCarreraAutorizadaIdGestionPeriodo( id:number, gestion:number,periodo:number){
      console.log("resultado");
      console.log(id);
      console.log(gestion);
      console.log(periodo);
      const ofertas = await this.dataSource.getRepository(OfertaCurricular)
      .createQueryBuilder("o")
      .innerJoinAndSelect("o.planEstudioAsignatura", "pa")       
      .innerJoinAndSelect("pa.planEstudioCarrera", "pe")       
      .innerJoinAndSelect("pa.regimenGradoTipo", "rg")     
      .innerJoinAndSelect("pa.asignaturaTipo", "at")       
      .innerJoinAndSelect("o.aulas", "a")       
      .innerJoinAndSelect("a.paraleloTipo", "pt")       
      .innerJoinAndSelect("a.aulasDetalles", "d")       
      .innerJoinAndSelect("d.diaTipo", "dt")       
      .select([
          'o.id',
          //'o.institutoPlanEstudioCarreraId',
          'pa.id',
          'pa.horas',
          'at.id',
          'at.asignatura',
          'at.abreviacion',
          'rg.id',
          'rg.regimenGrado',
          'a.id',
          'a.cupo',
          'pt.paralelo',
          'd.horaInicio',
          'd.horaFin',
          'd.numeroAula',  
          'dt.dia'

      ])
      .where('o.institutoPlanEstudioCarreraId = :id ', { id })
      .andWhere('o.gestionTipoId = :gestion ', { gestion })
      .andWhere('o.periodoTipoId = :periodo ', { periodo })
      .orderBy('at.id', 'ASC')
      //.orderBy('a.id', 'ASC')
      //.getRawMany();
      .getMany();
      return ofertas;
  }
    async findOfertasByCarreraAutorizadaIdGestionPeriodoDocente( id:number, gestion:number,periodo:number){
      console.log("resultado aaaaaaaaaaaaaaaaaaaaaaaa");
      console.log(id);
      console.log(gestion);
      console.log(periodo);
      const ofertas = await this.dataSource.getRepository(OfertaCurricular)
      .createQueryBuilder("o")
      .leftJoinAndSelect("o.planEstudioAsignatura", "pa")       
      .leftJoinAndSelect("pa.planEstudioCarrera", "pe")       
      .leftJoinAndSelect("pa.regimenGradoTipo", "rg")     
      .leftJoinAndSelect("pa.asignaturaTipo", "at")       
      .leftJoinAndSelect("o.aulas", "a")       
      .leftJoinAndSelect("a.institutoEstudianteInscripcions", "iei")       
      .leftJoinAndSelect("a.paraleloTipo", "pt")       
      .leftJoinAndSelect("a.aulasDetalles", "d")       
      .leftJoinAndSelect("d.diaTipo", "dt")       
      .leftJoinAndSelect("a.aulasDocentes", "do")       
      .leftJoinAndSelect("do.maestroInscripcion", "m")       
      .leftJoinAndSelect("m.persona", "p")       
      .select([
          'o.id',
          'o.institutoPlanEstudioCarreraId',
          'pa.id',
          'pa.horas',
          'at.id',
          'at.asignatura',
          'at.abreviacion',
          'rg.id',
          'rg.regimenGrado',
          'a.id',
          'a.cupo',
          'pt.id',
          'pt.paralelo',
          'd.id',
          'd.horaInicio',
          'd.horaFin',
          'd.numeroAula',  
          'dt.id',  
          'dt.dia',  
          'do.id',  
          'do.asignacionFechaInicio',  
          'do.asignacionFechaFin',
          'do.bajaTipoId',
          'm.id',  
          'm.vigente',  
          'p.paterno',  
          'p.materno',  
          'p.nombre',  
          'p.carnetIdentidad',  
          'iei.id',  
      ])
      .where('o.institutoPlanEstudioCarreraId = :id ', { id })
      .andWhere('o.gestionTipoId = :gestion ', { gestion })
      .andWhere('o.periodoTipoId = :periodo ', { periodo })
      .orderBy('a.id', 'ASC')
      .orderBy('do.id', 'DESC')
      .orderBy('o.id', 'ASC')
      .orderBy('pa.id', 'ASC')
      .orderBy('at.id', 'ASC')
    
      //.getRawMany();
      .getMany();
      return ofertas;
  }

    async createOfertaCurricular(dto, transaction) {
        const oc  = new OfertaCurricular();
        oc.institutoPlanEstudioCarreraId = dto.instituto_plan_estudio_carrera_id;
        oc.gestionTipoId = dto.gestion_tipo_id;
        oc.periodoTipoId = dto.periodo_tipo_id;
        oc.planEstudioAsignaturaId = dto.plan_estudio_asignatura_id;
        oc.usuarioId = dto.usuario_id;
      return await transaction.getRepository(OfertaCurricular).save(oc)
    }

    async crear(
        dto:CreateOfertaCurricularDto
      
      ) {
        /*const personaResult = await transaction.getRepository(OfertaCurricular).save(
          new OfertaCurricular({
            institutoPlanEstudioCarreraId = dto.instituto_plan_estudio_carrera_id,
            gestionTipoId = dto.instituto_plan_estudio_carrera_id,
            
          })
        )*/
    /*
        const usuarioResult = await transaction.getRepository(Usuario).save(
          new Usuario({
            idPersona: personaResult.id,
            usuarioRol: [],
            usuario: usuarioDto.usuario || usuarioDto?.persona?.nroDocumento, // TODO revisar usuario
            estado: usuarioDto?.estado ?? Status.CREATE,
            correoElectronico: usuarioDto?.correoElectronico,
            contrasena:
              usuarioDto?.contrasena ??
              (await TextService.encrypt(TextService.generateUuid())),
            ciudadaniaDigital: usuarioDto?.ciudadaniaDigital ?? false,
            usuarioCreacion: usuarioAuditoria,
          })
        )
    
        const usuarioRoles: QueryDeepPartialEntity<UsuarioRol>[] =
          usuarioDto.roles.map((idRol) => {
            // Rol
            const rol = new Rol()
            rol.id = idRol
    
            // UsuarioRol
            const usuarioRol = new UsuarioRol()
            usuarioRol.rol = rol
            usuarioRol.usuarioCreacion = usuarioAuditoria
            usuarioRol.idUsuario = usuarioResult.id
    
            return usuarioRol
          })
    
        await transaction
          .createQueryBuilder()
          .insert()
          .into(UsuarioRol)
          .values(usuarioRoles)
          .execute()
    */
        return 1;
      }
    async deleteOferta(id: number) {
        return await this.dataSource.getRepository(OfertaCurricular).delete(id)
    }
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
  
}
