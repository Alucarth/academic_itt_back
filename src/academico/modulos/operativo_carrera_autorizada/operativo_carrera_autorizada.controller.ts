import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CreateOperativoCarreraAutorizadaDto } from './dto/createOperativoCarreraAutorizada.dto';
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
    async getAllOperativosCarrera(@Param('id') id: number,){
        return await this.operativoCarreraAutorizadaService.findAllOperativosCarrera(id);
    }

    @Post()
    async createOperativoCarrera(@Body() dto: CreateOperativoCarreraAutorizadaDto){
        console.log('controller insert',dto);
        return  await this.operativoCarreraAutorizadaService.createOperativoCarrera(dto);        
    }
}
