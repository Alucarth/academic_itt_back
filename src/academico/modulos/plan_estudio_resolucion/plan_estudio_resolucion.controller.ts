import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { PlanEstudioResolucion } from 'src/academico/entidades/planEstudioResolucion.entity';
import { CreatePlanEstudioResolucionDto } from './dto/createPlanEstudioResolucion.dto';
import { CreateResolucionDto } from './dto/createResolucion.dto';
import { PlanEstudioResolucionService } from './plan_estudio_resolucion.service';

@Controller('plan-estudio-resolucion')
export class PlanEstudioResolucionController {
    constructor(
        private readonly planEstudioResolucionService: PlanEstudioResolucionService
    ){}

    @Get()
    async getResoluciones(){
       return await this.planEstudioResolucionService.getOnlyResoluciones();
    }
    @Get('detalle')
    async getPlanesResoluciones(){
       return await this.planEstudioResolucionService.getResolucionesAll();
    }
    @Get('ofertas/:id')
    async getPlanesResolucionesOfertas(@Param('id') id: number){
       return await this.planEstudioResolucionService.getCarrerasOfertasById(id);
    }

    @Post()
    async addPlanCarreraAutorizada(@Body() dto: CreatePlanEstudioResolucionDto) {
      console.log("-*************-");
      return await this.planEstudioResolucionService.crear(dto);
    }
    @Post('resolucion')
    async addResolucion(@Body() dto: CreateResolucionDto) {
      console.log("-*************- RESOLUCION");
      return await this.planEstudioResolucionService.createNewResolucion(dto);
    }
    @Put(':id')
    async editDatoResolucion(@Param('id') id: number, @Body() dto: CreateResolucionDto) {
      console.log("-*************- EDIT RESOLUCION");
      return await this.planEstudioResolucionService.editDatoResolucion(id,dto);
    }
    @Put('estado-carrera/:id/:ca')
    async editEstadoResolucion(@Param('id') id: number, @Param('ca') ca: number) {
      console.log("-*************- EDIT ESTADO RESOLUCION");
      //return await this.planEstudioResolucionService.editEstadoResolucion(id,ca);
      return await this.planEstudioResolucionService.editEstadoResolucionCarrera(id,ca);

    }
    @Delete("/:id")
    async deleteResolucion(@Param("id") id: string) {
      return await this.planEstudioResolucionService.deleteResolucion(parseInt(id));
    }
    @Delete("asignacion/:id/:ca")
    async deleteCarreraResolucion(@Param("id") id: string, @Param("ca") ca: string) {
      return await this.planEstudioResolucionService.deleteResolucionCarrera(parseInt(id), parseInt(ca));
    }

}
