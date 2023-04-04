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
import { MallaCurricularService } from "./malla-curricular.service";

@Controller("malla-curricular")
export class MallaCurricularController {
  constructor(private readonly mallaService: MallaCurricularService) {}

  @Get("/getAllCarrerasByInstitutoId/:institutoId")
  getAllCarrerasByInstitutoId(@Param("institutoId") institutoId: string) {
    return this.mallaService.getAllCarrerasByInstitutoId(parseInt(institutoId));
  }
}
