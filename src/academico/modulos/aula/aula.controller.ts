import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/createAula.dto';

@Controller('aula')
export class AulaController {
    constructor (
        private readonly aulaService: AulaService,
        ){}

    @Get()
    async getAllBy(){
        return await this.aulaService.getAll();
    }
    @Get(':id')
    async getById(@Param("id", ParseIntPipe) id: number){
        return await this.aulaService.getById(id);
    }
    @Get('calificaciones/:id')
    async getCalificacionesById(@Param("id", ParseIntPipe) id: number){
        return await this.aulaService.getCalificacionesById(id);
    }
    @Post('crea-actualiza')
    async createUpdateAulaDetalle(@Body() dto: CreateAulaDto) {
      return await this.aulaService.createUpdateAulaDetalle(dto);
    }

    @Delete("/:id")
    async deleteAula(@Param("id") id: string) {
      return await this.aulaService.deleteAula(parseInt(id));
    }
}
