import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AreaTipoService } from "./area_tipo.service";
import { ApiTags } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@ApiTags("Crud Catalogo Area Tipo")
@Controller("area-tipo")
export class AreaTipoController {
  constructor(private readonly areaTipoService: AreaTipoService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getAll() {
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

  @Post()
  async addAreaTipo(@Body() body) {
    return await this.areaTipoService.insertRecord(body);
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
