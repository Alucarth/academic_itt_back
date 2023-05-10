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
import { ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { AsignaturaTipoService } from "./asignatura_tipo.service";
import { CreateAsignaturaTipoDto } from "./dto/createAsignaturaTipo.dto";

@Controller("asignatura-tipo")
export class AsignaturaTipoController {
  constructor(private readonly asignaturaTipoService: AsignaturaTipoService) {}

  @Post('')
  @ApiOperation({
    summary: "Crea un asignatura",
  }) 
  create(@Body() createAsignaturaTipoDto: CreateAsignaturaTipoDto) {
    return this.asignaturaTipoService.create(createAsignaturaTipoDto);
  }
}
