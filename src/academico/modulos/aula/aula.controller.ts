import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/createAula.dto';
import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';

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

    @Get('check_duplicate/:aula_id')
    async checkDuplicate(@Param("aula_id", ParseIntPipe) aula_id: number){
        return await this.aulaService.checkDuplicate(aula_id);
    }


    @Auth()
    @Post('crea-actualiza')
    async createUpdateAulaDetalle(@Body() dto: CreateAulaDto,  @Users() user: UserEntity) {
      return await this.aulaService.createUpdateAulaDetalle(dto, user);
    }

    @Delete("/:id")
    async deleteAula(@Param("id") id: string) {
      return await this.aulaService.deleteAula(parseInt(id));
    }
}
