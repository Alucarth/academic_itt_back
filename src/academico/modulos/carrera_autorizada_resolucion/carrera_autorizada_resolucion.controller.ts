import { Controller } from '@nestjs/common';

@Controller('carrera-autorizada-resolucion')
<<<<<<< HEAD
export class CarreraAutorizadaResolucionController {
    constructor(private readonly carreraAutorizadaResolucionService: CarreraAutorizadaResolucionService) {}
    
    @Get(":id")
    async getById(
      @Param("id", ParseIntPipe) id: number
    ) {
      return await this.carreraAutorizadaResolucionService.getOneById(id);
    }
/*
    async actualizarRoles(id, roles, usuarioAuditoria) {
        const usuarioRoles =
          await this.usuarioRolRepositorio.obtenerRolesPorUsuario(id)
    
        const { inactivos, activos, nuevos } = this.verificarUsuarioRoles(
          usuarioRoles,
          roles
        )
    
        // ACTIVAR roles inactivos
        if (inactivos.length > 0) {
          await this.usuarioRolRepositorio.activar(id, inactivos, usuarioAuditoria)
        }
        // INACTIVAR roles activos
        if (activos.length > 0) {
          await this.usuarioRolRepositorio.inactivar(id, activos, usuarioAuditoria)
        }
        // CREAR nuevos roles
        if (nuevos.length > 0) {
          await this.usuarioRolRepositorio.crear(id, nuevos, usuarioAuditoria)
        }
      }*/
}
=======
export class CarreraAutorizadaResolucionController {}
>>>>>>> ec8ea5b0c2aad791f271e2c95850f9c3848a7cd6
