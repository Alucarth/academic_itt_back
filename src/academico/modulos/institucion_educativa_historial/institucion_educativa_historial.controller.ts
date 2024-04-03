import { Auth } from 'src/auth/decorator/auth.decorator';
import { InstitucionEducativaHistorialService } from './institucion_educativa_historial.service';
import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { Users } from 'src/users/decorator/user.decorator';
import { User } from 'src/users/entity/users.entity';
import { CreateInstitucionEducativaHistorialDto } from './dto/createInstitucionEducativaHistorial.dto';

@Controller('institucion-educativa-historial')
export class InstitucionEducativaHistorialController {
    constructor(
        private readonly institucionEducativaHistorialService: InstitucionEducativaHistorialService 
    ){}

    @Get(':institucion_educativa_id')
    async getInstitutionHistory( @Param('institucion_educativa_id', ParseIntPipe) institucion_educativa_id: number)
    {
        return this.institucionEducativaHistorialService.getInstituteHistory(institucion_educativa_id)
    }

    @Auth() 
    @Post('create-history')
    async createInstitutionHistory(@Body() payload: CreateInstitucionEducativaHistorialDto, @Users() user: User)
    {
        console.log('payload =>', payload)
        return await this.institucionEducativaHistorialService.createInstitutionHistory( payload, user)
    }
}