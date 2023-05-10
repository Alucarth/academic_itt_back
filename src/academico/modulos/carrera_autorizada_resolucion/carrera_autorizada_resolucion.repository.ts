import { Injectable } from '@nestjs/common'
import { CarreraAutorizada } from 'src/academico/entidades/carreraAutorizada.entity';
import { CarreraAutorizadaResolucion } from 'src/academico/entidades/carreraAutorizadaResolucion.entity';
import { EtapaEducativaAsignatura } from 'src/academico/entidades/etapaEducativaAsignatura.entity';
import { InstitucionEducativaCurso } from 'src/academico/entidades/institucionEducativaCurso.entity';
import { OfertaAcademica } from 'src/academico/entidades/ofertaAcademica.entity';
import { DataSource, EntityManager } from 'typeorm'

@Injectable()
export class CarreraAutorizadaResolucionRepository {
    
    constructor(private dataSource: DataSource) {}

    async getOneBy(id){
        return  await this.dataSource.getRepository(CarreraAutorizadaResolucion).findBy({ id: id });
        
    }
    async getAll(){
        return  await this.dataSource.getRepository(CarreraAutorizadaResolucion).find();
        
    }
   
    /*
  async crear(
    dto: CrearUsuarioDto,
    usuarioAuditoria: string,
    transaction: EntityManager
  ) {
    const carreraAutorizada = await transaction.getRepository(CarreraAutorizada).save(
      new CarreraAutorizada({
        institucionEducativaSucursalId: dto.sucursalId,
        carreraTipoId: dto.carreraTipoId,
        areaTipoId: dto.areaTipoId,
        usuarioId: usuarioAuditoria,
      })
    )

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
  }*/
    async runTransaction<T>(op: (entityManager: EntityManager) => Promise<T>) {
        return this.dataSource.manager.transaction<T>(op)
    }
}
