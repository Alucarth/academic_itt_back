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
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
  
}