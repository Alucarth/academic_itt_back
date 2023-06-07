import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { User } from 'src/users/entity/users.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CreateOperativoCarreraAutorizadaDto } from './dto/createOperativoCarreraAutorizada.dto';
import { UpdateOperativoCarreraAutorizadaDto } from './dto/updateOperativoCarreraAutorizada.dto';
import { OperativoCarreraAutorizadaService } from './operativo_carrera_autorizada.service';

@Controller('operativo-carrera-autorizada')
export class OperativoCarreraAutorizadaController {
    constructor(
        private readonly operativoCarreraAutorizadaService: OperativoCarreraAutorizadaService,
        private _serviceResp: RespuestaSigedService,
    ){}

    @Get()
    async getAllOperativos():Promise<OperativoCarreraAutorizada[]>{
        return await this.operativoCarreraAutorizadaService.findAllOperativos();
    }
    @Get('carrera/:id')
    async getAllOperativosCarrera(@Param('id') id: number){
        return await this.operativoCarreraAutorizadaService.findAllOperativosCarrera(id);
    }
    
    @Get('vigente/carrera/:id')
    async getOperativoVigenteCarrera(@Param('id') id: number,){
        return await this.operativoCarreraAutorizadaService.findOperativoActivoCarrera(id);
    }

    @Post()
    async createOperativoCarrera(@Body() dto: CreateOperativoCarreraAutorizadaDto){
        console.log('controller insert',dto);
        return  await this.operativoCarreraAutorizadaService.createOperativoCarrera(dto);        
    }

   // @Autenticacion()
    @Put('estado/:id')
    async editEstadoOperativoCarrera(@Param('id') id: number){
        const data = await this.operativoCarreraAutorizadaService.editEstadoById(id);
        return data;
    }
    @Put(':id')
    async editOperativoCarrera(@Param('id') id: number, @Body() dto: UpdateOperativoCarreraAutorizadaDto){
        const data = await this.operativoCarreraAutorizadaService.editOperativoCarreraById(id,dto);
        return data;
    }
    @Delete("/:id")
    async deleteAreaTipo(@Param("id") id: string) {
      return await this.operativoCarreraAutorizadaService.deleteOperativoCarrera(parseInt(id));
    }
}
