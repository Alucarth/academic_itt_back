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
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";

@ApiTags("Crud Catalogo Area Tipo")
@Controller("area-tipo")
export class AreaTipoController {
  constructor(private readonly areaTipoService: AreaTipoService) {}

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post()
  async addAreaTipo(@Body() body, @Req() request: Request) {
    return await this.areaTipoService.insertRecord(body, request);
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
