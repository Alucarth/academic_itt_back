import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { AsignaturaTipoService } from "./asignatura_tipo.service";
import { CreateAsignaturaTipoDto } from "./dto/createAsignaturaTipo.dto";

@ApiTags("Crud Catalogo Asignatura Tipo")
@Controller("asignatura-tipo")
export class AsignaturaTipoController {
  constructor(private readonly asignaturaTipoService: AsignaturaTipoService) {}

  @Get()
  @ApiOperation({
    summary: "Devuelve todas las Asignaturas",
  })
  async getAll() {
    return await this.asignaturaTipoService.getAll();
  }

  @Post("")
  @ApiOperation({
    summary: "Crea un asignatura",
  })
  create(@Body() createAsignaturaTipoDto: CreateAsignaturaTipoDto) {
    return this.asignaturaTipoService.create(createAsignaturaTipoDto);
  }

  @Put("")
  @ApiOperation({
    summary: "Actualiza un asignatura",
  })
  update(@Body() createAsignaturaTipoDto: CreateAsignaturaTipoDto) {
    return this.asignaturaTipoService.update(createAsignaturaTipoDto);
  }

  @ApiOperation({
    summary: "Elimina un asignatura",
  })
  @Delete("/:id")
  async deleteCarreraTipo(@Param("id") id: string) {
    return await this.asignaturaTipoService.deleteRecord(parseInt(id));
  }
}
