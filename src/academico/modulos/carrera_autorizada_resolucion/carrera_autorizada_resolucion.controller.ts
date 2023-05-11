import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { CarreraAutorizadaResolucionService } from './carrera_autorizada_resolucion.service';
import { CreateCarreraAutorizadaResolucionDto } from './dto/createCarreraAutorizadaResolucion.dto';

@Controller('carrera-autorizada-resolucion')

export class CarreraAutorizadaResolucionController {
    constructor(private readonly carreraAutorizadaResolucionService: CarreraAutorizadaResolucionService) {}
    
    @Get(":id")
    async getById(
      @Param("id", ParseIntPipe) id: number
    ) {
      return await this.carreraAutorizadaResolucionService.getOneById(id);
    }

     //create carrera_autorizada_resolucion
   // @UseGuards(JwtAuthGuard, CasbinGuard)
    @Post()
    async crear( @Body() dto: CreateCarreraAutorizadaResolucionDto) {
       
       // return await this.carreraAutorizadaResolucionService.crear(dto)
       
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

