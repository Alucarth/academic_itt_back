import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InstitucionEducativaSucursal } from 'src/academico/entidades/institucionEducativaSucursal.entity';
import { InstitucionEducativaSucursalService } from './institucion_educativa_sucursal.service';

@ApiTags('institucion-educativa-sucursal')
@Controller('institucion-educativa-sucursal')
export class InstitucionEducativaSucursalController {
    constructor(
        private readonly institucionEducativaSucursalService: InstitucionEducativaSucursalService
    ){}

    @Get('itts')
    async getAllIttSucursales():Promise<InstitucionEducativaSucursal[]>{
        return await this.institucionEducativaSucursalService.getAllIttSucursales();
    }
    @Get(':sie')
    async getBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativaSucursal[]>{
        return await this.institucionEducativaSucursalService.findSucursalBySie(sie);
    }
    @Get(':sie/:gestion')
    async getBySieGestion(@Param('sie', ParseIntPipe) sie: number, @Param('gestion', ParseIntPipe) gestion: number):Promise<InstitucionEducativaSucursal>{
        
        return await this.institucionEducativaSucursalService.findSucursalBySieGestion(sie, gestion);
    }
    
    @Get('especialidades/:sie')
    async getEspecialidadesBySie(@Param('sie', ParseIntPipe) sie: number):Promise<InstitucionEducativaSucursal[]>{
        return await this.institucionEducativaSucursalService.findEspecialidadesBySie(sie);
    }
    @Get('especialidades-sucursal/:id')
    async getEspecialidadesById(@Param('id', ParseIntPipe) id: number):Promise<InstitucionEducativaSucursal[]>{
        return await this.institucionEducativaSucursalService.findEspecialidadesBySucursal(id);
    }
}


