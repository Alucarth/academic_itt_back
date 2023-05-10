import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AreaTipoService } from "./area_tipo.service";
import { ApiTags } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";

@ApiTags("Crud Catalogo Area Tipo")
@Controller("area-tipo")
export class AreaTipoController {
  constructor(private readonly areaTipoService: AreaTipoService) {}

  @Get()
  async getAll() {
    return await this.areaTipoService.getAll();
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
