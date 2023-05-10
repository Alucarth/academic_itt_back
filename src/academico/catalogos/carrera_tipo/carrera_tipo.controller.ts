import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { CarreraTipoService } from "./carrera_tipo.service";
import { ApiTags } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";

@ApiTags("Crud Catalogo Carrera Tipo")
@Controller("carrera-tipo")
export class CarreraTipoController {
  constructor(private readonly carreraTipoService: CarreraTipoService) {}

  @Get()
  async getAll() {
    return await this.carreraTipoService.getAll();
  }

  @Get("getById/:id")
  async getOneById(@Param("id") id: string) {
    return await this.carreraTipoService.getOneById(parseInt(id));
  }

  @Post()
  async addCarreraTipo(@Body() body) {
    return await this.carreraTipoService.insertRecord(body);
  }

  @Put()
  async updateCarreraTipo(@Body() body) {
    return await this.carreraTipoService.updateRecord(body);
  }

  @Delete("/:id")
  async deleteCarreraTipo(@Param("id") id: string) {
    return await this.carreraTipoService.deleteRecord(parseInt(id));
  }
}
