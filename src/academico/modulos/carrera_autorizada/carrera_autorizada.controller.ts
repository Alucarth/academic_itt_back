import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarreraAutorizadaService } from './carrera_autorizada.service';

@Controller('carrera-autorizada')
export class CarreraAutorizadaController {
    constructor(private readonly carreraAutorizadaService: CarreraAutorizadaService) {}
    
    @Get("sucursal/:id")
    async getCarrerasBySucursalId(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarrerasBySucursalId(id);
    }
    @Get("ie/:id")
    async getCarrerasByIeId(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarrerasByIeId(id);
    }
    @Get("cursos/ie/:id")
    async getCursosByIeId(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCursosByIeId(id);
    }

    @Get(":id")
    async getCarreraById(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarreraById(id);
    }

    @Get('reporte/totales')
    async getTotalCarreras(){
        console.log("total carreras");
        return await this.carreraAutorizadaService.getTotalCarreras();
    }

    @Get('reporte/estudiantes/:id')
    async getListaEstudiantes(@Param("id", ParseIntPipe) id: number){
        console.log("total estudiantes");
        return await this.carreraAutorizadaService.getTotalEstudiantes(id);
    }
    @Get('reporte/regimen-estudiantes/:id')
    async getListaEstudiantesRegimen(@Param("id", ParseIntPipe) id: number){
        console.log("lista carreras, regimen y total de estudiantes");
        return await this.carreraAutorizadaService.getListaCarrerasRegimen(id);
    }
}
