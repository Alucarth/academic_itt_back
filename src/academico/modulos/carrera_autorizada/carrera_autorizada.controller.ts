import { Controller, Delete, Get, Header, Param, ParseIntPipe } from '@nestjs/common';
import { CarreraAutorizadaService } from './carrera_autorizada.service';

import { Response } from "express";
import { Res } from "@nestjs/common";
@Controller('carrera-autorizada')
export class CarreraAutorizadaController {
    constructor(private readonly carreraAutorizadaService: CarreraAutorizadaService) {}
    
    @Get("sucursal/:id")
    async getCarrerasBySucursalId(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarrerasBySucursalId(id);
    }
    @Get("ie/:id")
    async getCarrerasByIeId(@Param("id", ParseIntPipe) id: number) {
      console.log('insitituton detail career')
      return await this.carreraAutorizadaService.getCarrerasByIeId(id);
    }

    @Get("ie_report/:id")
    async getCarrerasReportByIeId(@Param("id", ParseIntPipe) id: number) {
      console.log('insitituton detail career')
      return await this.carreraAutorizadaService.getReportCareer(id);
    }
    
    @Get("career_list/:id")
    async getCareerList(@Param("id", ParseIntPipe) id: number) {
      console.log('list career in show insitute')
      return await this.carreraAutorizadaService.getCareerInstitute(id);
    }

    @Get("cursos/ie/:id")
    async getCursosByIeId(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCursosByIeId(id);
    }

    @Get(":id")
    async getCarreraById(@Param("id", ParseIntPipe) id: number) {
      return await this.carreraAutorizadaService.getCarreraById(id);
    }

    @Get("detail-teacher/:carrera_autorizada_id")
    async getTeacherDetail(@Param("carrera_autorizada_id", ParseIntPipe) carrera_autorizada_id: number)
    {
      return await this.carreraAutorizadaService.getDetailTeacher(carrera_autorizada_id)
    }

    @Get('total-detail-institution/:id')
    async getTotalInstitutionDetail(@Param("id", ParseIntPipe) id: number)
    {
      return await this.carreraAutorizadaService.getTotalInsitution(id);
    }

    @Get('reporte/totales')
    async getTotalCarreras(){
        console.log("total carreras");
        return await this.carreraAutorizadaService.getTotalCarreras();
    }
    @Get('reporte/lista')
    async getListaCarreras(){
        console.log("lista carreras");
        return await this.carreraAutorizadaService.getListaCarreras();
    }

    @Get('reporte/dependencias')
    async getTotalEstudiantesDependencia(){
        console.log("total carreras por departamento y dependencia");
        return await this.carreraAutorizadaService.getTotalDepartamentoDependencias();
  }

    @Get('reporte/estudiantes/:id')
    async getListaEstudiantes(@Param("id", ParseIntPipe) id: number){
        console.log("total estudiantes");
        return await this.carreraAutorizadaService.getTotalEstudiantes(id);
    }

    @Get('reporte/paralelos-estudiantes/:id')
    async getListaParalelosEstudiantes(@Param("id", ParseIntPipe) id: number){
        console.log("total estudiantes");
        return await this.carreraAutorizadaService.getListaParalelosEstudiantes(id);
    }
    @Get('reporte/asignaturas-paralelos-estudiantes/:id')
    async getListaAsignaturasParalelosEstudiantes(@Param("id", ParseIntPipe) id: number){
        console.log("total asignaturas, paralelos con la cantidad de estudiantes por carreraId");
        return await this.carreraAutorizadaService.getListaAsignaturasParaleloEstudiantes(id);
    }
    /* aqui reporte de estudiante por genero */
    @Get('reporte/carrera-paralelo-estudiante/:id')
    async getListaCarreraParalelosEstudiantes(@Param("id", ParseIntPipe) id: number){
        console.log("carrera asignaturas total parelelos y total estudiantes ------------>");
        return await this.carreraAutorizadaService.getListaAsignaturaParaleloEstudianteCarrera(id);
    }
    @Get('reporte/carreras-estudiantes/:lugar/:dependencia')
    async getListaEstudiantesRegimen(@Param("lugar", ParseIntPipe) lugar: number, @Param("dependencia", ParseIntPipe) dependencia: number){
        console.log("lista carreras, regimen, instituto y total de estudiantes -->");
        return await this.carreraAutorizadaService.getListaCarrerasRegimen(lugar, dependencia);
    }

    @Get('reporte/institutions-by-career/:carrera')
    async getInstitutionsByCarrera(@Param("carrera") carrera: number){
        console.log("lista de insititutos por carrera -->");
        return await this.carreraAutorizadaService.getInsitutionsByCareer(carrera);
    }
    @Get("xlsIe/:id")
    @Header("Content-Type", "text/xlsx")
    async getXlsCarrerasByIeId(@Param("id", ParseIntPipe) id: number, @Res() res: Response) {
      let result =  await this.carreraAutorizadaService.xlsGetCarrerasByIeId(id);
      res.download(`${result}`);
    }

    @Get("ieGestionPeriodo/:id/:gestion/:periodo")
    async getCarrerasByIeIdGestionPeriodo(
      @Param("id", ParseIntPipe) id: number,
      @Param("gestion", ParseIntPipe) gestion: number,
      @Param("periodo", ParseIntPipe) periodo: number
      ) {
      return await this.carreraAutorizadaService.getCarrerasByIeIdGestionPeriodo(id, gestion, periodo);
    }

    
    @Delete(':id')
    async softDeleteById( @Param('id', ParseIntPipe ) id: number)
    {
      return await this.carreraAutorizadaService.softDelete(id)
    }


}
