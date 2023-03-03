import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Operativo } from 'src/academico/entidades/operativo.entity';
import { OperativoService } from './operativo.service';

@ApiTags('operativo')
@Controller('operativo')
export class OperativoController {
    constructor (
        private readonly operativoService: OperativoService 
        ){}
        
    @Get()
    async getAll():Promise<Operativo[]>{
        return await this.operativoService.findAll();
    }
    @Get('sucursal/:id')
    async getGestionesSucursal(@Param('id', ParseIntPipe) id: number):Promise<Operativo[]>{
        return await this.operativoService.findGestionesSucursal(id);
    }

    @Get('vigente/:sie')
    async getGestionVigente(@Param('sie', ParseIntPipe) sie: number):Promise<Operativo[]>{
        return await this.operativoService.findGestionVigente(sie);
    }
}
