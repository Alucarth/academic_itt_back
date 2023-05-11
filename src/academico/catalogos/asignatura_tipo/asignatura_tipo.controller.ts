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
}
