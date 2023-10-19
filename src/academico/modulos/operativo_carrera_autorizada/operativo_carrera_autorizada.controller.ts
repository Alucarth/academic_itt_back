import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OperativoCarreraAutorizada } from 'src/academico/entidades/operativoCarreraAutorizada.entity';
import { User } from 'src/users/entity/users.entity';
import { RespuestaSigedService } from 'src/shared/respuesta.service';
import { CreateOperativoCarreraAutorizadaDto } from './dto/createOperativoCarreraAutorizada.dto';
import { UpdateOperativoCarreraAutorizadaDto } from './dto/updateOperativoCarreraAutorizada.dto';
import { OperativoCarreraAutorizadaService } from './operativo_carrera_autorizada.service';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { UpdateFechaOperativoCarreraAutorizadaDto } from './dto/updateFechaOperativoCarreraAutorizada.dto';


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
    @Auth()
    @Post()
    async createOperativoCarrera(@Body() dto: CreateOperativoCarreraAutorizadaDto, @Users() user: UserEntity){
        console.log('controller insert',dto);
        return  await this.operativoCarreraAutorizadaService.createOperativoCarrera(dto, user);        
    }

   // @Autenticacion()
    @Get('estado/:id')
    async editEstadoOperativoCarrera(@Param('id') id: number){
        const data = await this.operativoCarreraAutorizadaService.editEstadoById(id);
        return data;
    }
    @Put(':id')
    async editOperativoCarrera(@Param('id') id: number, @Body() dto: UpdateOperativoCarreraAutorizadaDto){
        const data = await this.operativoCarreraAutorizadaService.editOperativoCarreraById(id,dto);
        return data;
    }
    @Put('fechas/:id')
    async editFechaOperativoCarrera(@Param('id') id: number, @Body() dto: UpdateFechaOperativoCarreraAutorizadaDto){
        const data = await this.operativoCarreraAutorizadaService.editFechaOperativoCarreraById(id,dto);
        return data;
    }
    @Delete("/:id")
    async deleteAreaTipo(@Param("id") id: string) {
      return await this.operativoCarreraAutorizadaService.deleteOperativoCarrera(parseInt(id));
    }
}
