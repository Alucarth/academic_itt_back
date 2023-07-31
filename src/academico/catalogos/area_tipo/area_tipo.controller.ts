import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Delete,
  Req,
} from "@nestjs/common";
import { AreaTipoService } from "./area_tipo.service";
import { ApiTags } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { Auth } from "src/auth/decorator/auth.decorator";
import { Users } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from 'src/users/entity/users.entity';
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@ApiTags("Crud Catalogo Area Tipo")
@Controller("area-tipo")
export class AreaTipoController {
  constructor(private readonly areaTipoService: AreaTipoService) {}

  
 
  @Auth()
  @Get()
  async getAll(@Users() user: UserEntity) {
    console.log("usuario-----autenticado-------",user)
    return await this.areaTipoService.getAll();
  }
  @Get("cursos")
  async getAllCursosAreas() {
    return await this.areaTipoService.getListAreasCursos();
  }

  @Get("getById/:id")
  async getOneById(@Param("id") id: string) {
    return await this.areaTipoService.getOneById(parseInt(id));
  }

  @Auth()
  @Post()
  async addAreaTipo(@Body() body, @Users() user: UserEntity) {
    return await this.areaTipoService.insertRecord(body, user);
  }

  @Put()
  async updateAreaTipo(@Body() body) {
    return await this.areaTipoService.updateRecord(body);
  }

  @Delete("/:id")
  async deleteAreaTipo(@Param("id") id: string) {
    return await this.areaTipoService.deleteRecord(parseInt(id));
  }
}
